from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta, date
from jose import JWTError, jwt
import json
from .database import get_db_connection, init_db_pool
import oracledb

router = APIRouter()

# Configuración JWT
SECRET_KEY = "supersecreto"   # en producción: usar os.environ
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/login")

class UserRegister(BaseModel):
    username: str
    password: str

class UserData(BaseModel):
    score: int = 0
    words: list[str] = []

class LetterProgress(BaseModel):
    letra: str
    estado: int  # 0: incorrecta, 1: en palabra pero lugar incorrecto, 2: correcta

class DailyProgress(BaseModel):
    palabra_completada: str
    intentos: int
    score: int
    letras: dict  # Diccionario con letras y su estado

class UpdateProgressRequest(BaseModel):
    score: int
    word: str
    intentos: int
    letras: dict

# Funciones auxiliares
def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    """Obtiene el usuario actual desde la base de datos usando el token JWT"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        
        conn = get_db_connection()
        try:
            cursor = conn.cursor()
            cursor.execute(
                "SELECT user_id, username, password_hash FROM usuarios WHERE username = :username",
                {"username": username}
            )
            result = cursor.fetchone()
            if not result:
                raise HTTPException(status_code=401, detail="Usuario no encontrado")
            
            return {
                "user_id": result[0],
                "username": result[1],
                "password_hash": result[2]
            }
        finally:
            conn.close()
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

# Registro
@router.post("/register")
def register_user(user: UserRegister):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        
        # Verificar si el usuario ya existe
        cursor.execute(
            "SELECT username FROM usuarios WHERE username = :username",
            {"username": user.username}
        )
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Usuario ya existe")

        # Insertar nuevo usuario
        password_hash = get_password_hash(user.password)
        cursor.execute(
            """INSERT INTO usuarios (username, password_hash) 
               VALUES (:username, :password_hash)""",
            {"username": user.username, "password_hash": password_hash}
        )
        conn.commit()
        return {"message": "Usuario registrado exitosamente"}
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al registrar usuario: {str(e)}")
    finally:
        conn.close()

# Login
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT user_id, username, password_hash FROM usuarios WHERE username = :username",
            {"username": form_data.username}
        )
        result = cursor.fetchone()
        
        if not result:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")
        
        user_id, username, password_hash = result
        
        if not verify_password(form_data.password, password_hash):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
            data={"sub": username},
        expires_delta=access_token_expires
    )
        return {"access_token": token, "token_type": "bearer", "user_id": user_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en login: {str(e)}")
    finally:
        conn.close()

# Obtener progreso (protegido)
@router.get("/progress")
def get_progress(current_user=Depends(get_current_user)):
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        user_id = current_user["user_id"]
        
        # Obtener score total y palabras completadas
        cursor.execute("""
            SELECT 
                COALESCE(SUM(score), 0) as score_total,
                LISTAGG(palabra_completada, ',') WITHIN GROUP (ORDER BY fecha DESC) as palabras
            FROM progreso_diario
            WHERE user_id = :user_id
        """, {"user_id": user_id})
        
        result = cursor.fetchone()
        score_total = result[0] if result else 0
        palabras_str = result[1] if result and result[1] else ""
        palabras = palabras_str.split(",") if palabras_str else []
        
        return {
            "score": score_total,
            "words": palabras
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener progreso: {str(e)}")
    finally:
        conn.close()

# Actualizar progreso (protegido) - Guarda letras completadas por día
@router.post("/progress")
def update_progress(
    progress_data: UpdateProgressRequest,
    current_user=Depends(get_current_user)
):
    """Guarda el progreso diario del usuario incluyendo las letras completadas"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        user_id = current_user["user_id"]
        fecha_actual = date.today()
        
        # Extraer datos del request
        score = progress_data.score
        word = progress_data.word
        intentos = progress_data.intentos
        letras = progress_data.letras
        
        # Convertir diccionario de letras a JSON string
        letras_json = json.dumps(letras)
        
        # Insertar o actualizar progreso diario
        cursor.execute("""
            MERGE INTO progreso_diario pd
            USING (SELECT :user_id as user_id, :fecha as fecha FROM dual) src
            ON (pd.user_id = src.user_id AND pd.fecha = src.fecha)
            WHEN MATCHED THEN
                UPDATE SET 
                    palabra_completada = :word,
                    intentos = :intentos,
                    score = :score,
                    letras_completadas = :letras_json
            WHEN NOT MATCHED THEN
                INSERT (user_id, fecha, palabra_completada, intentos, score, letras_completadas)
                VALUES (:user_id, :fecha, :word, :intentos, :score, :letras_json)
        """, {
            "user_id": user_id,
            "fecha": fecha_actual,
            "word": word,
            "intentos": intentos,
            "score": score,
            "letras_json": letras_json
        })
        
        # Guardar estadísticas de letras individuales
        for letra, estado in letras.items():
            if isinstance(estado, int) and estado in [0, 1, 2]:
                cursor.execute("""
                    INSERT INTO estadisticas_letras (user_id, letra, estado, fecha, palabra_id)
                    VALUES (:user_id, :letra, :estado, :fecha, 
                        (SELECT progreso_id FROM progreso_diario 
                         WHERE user_id = :user_id AND fecha = :fecha)
                    )
                """, {
                    "user_id": user_id,
                    "letra": letra.upper(),
                    "estado": estado,
                    "fecha": fecha_actual
                })
        
        conn.commit()
        
        # Obtener progreso actualizado
        cursor.execute("""
            SELECT COALESCE(SUM(score), 0), 
                   LISTAGG(palabra_completada, ',') WITHIN GROUP (ORDER BY fecha DESC)
            FROM progreso_diario
            WHERE user_id = :user_id
        """, {"user_id": user_id})
        
        result = cursor.fetchone()
        score_total = result[0] if result else 0
        palabras_str = result[1] if result and result[1] else ""
        palabras = palabras_str.split(",") if palabras_str else []
        
        return {
            "message": "Progreso actualizado",
            "data": {
                "score": score_total,
                "words": palabras
            }
        }
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar progreso: {str(e)}")
    finally:
        conn.close()

# Obtener letras completadas por día
@router.get("/progress/letters/{fecha}")
def get_letters_by_date(fecha: str, current_user=Depends(get_current_user)):
    """Obtiene las letras completadas en una fecha específica"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        user_id = current_user["user_id"]
        
        # Convertir string de fecha a date
        fecha_obj = datetime.strptime(fecha, "%Y-%m-%d").date()
        
        cursor.execute("""
            SELECT letras_completadas, palabra_completada, intentos
            FROM progreso_diario
            WHERE user_id = :user_id AND fecha = :fecha
        """, {"user_id": user_id, "fecha": fecha_obj})
        
        result = cursor.fetchone()
        if not result:
            return {"message": "No hay progreso para esta fecha", "letras": {}, "palabra": None}
        
        letras_json = result[0]
        palabra = result[1]
        intentos = result[2]
        
        letras = json.loads(letras_json) if letras_json else {}
        
        return {
            "fecha": fecha,
            "palabra_completada": palabra,
            "intentos": intentos,
            "letras": letras
        }
    except ValueError:
        raise HTTPException(status_code=400, detail="Formato de fecha inválido. Use YYYY-MM-DD")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener letras: {str(e)}")
    finally:
        conn.close()

# Obtener estadísticas de letras
@router.get("/statistics/letters")
def get_letter_statistics(current_user=Depends(get_current_user)):
    """Obtiene estadísticas de uso de letras del usuario"""
    conn = get_db_connection()
    try:
        cursor = conn.cursor()
        user_id = current_user["user_id"]
        
        cursor.execute("""
            SELECT letra, estado, COUNT(*) as cantidad
            FROM estadisticas_letras
            WHERE user_id = :user_id
            GROUP BY letra, estado
            ORDER BY letra, estado
        """, {"user_id": user_id})
        
        results = cursor.fetchall()
        estadisticas = {}
        
        for letra, estado, cantidad in results:
            if letra not in estadisticas:
                estadisticas[letra] = {"correcta": 0, "parcial": 0, "incorrecta": 0}
            
            if estado == 2:
                estadisticas[letra]["correcta"] = cantidad
            elif estado == 1:
                estadisticas[letra]["parcial"] = cantidad
            else:
                estadisticas[letra]["incorrecta"] = cantidad
        
        return {"estadisticas": estadisticas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {str(e)}")
    finally:
        conn.close()
