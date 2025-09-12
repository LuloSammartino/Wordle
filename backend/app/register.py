from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
import uuid

router = APIRouter()

# Configuración JWT
SECRET_KEY = "supersecreto"   # en producción: usar os.environ
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Simulación de base de datos en memoria
fake_users_db = {}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/login")

class UserRegister(BaseModel):
    username: str
    password: str

class UserData(BaseModel):
    score: int = 0
    words: list[str] = []

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
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None or username not in fake_users_db:
            raise HTTPException(status_code=401, detail="Token inválido")
        return fake_users_db[username]
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")

# Registro
@router.post("/register")
def register_user(user: UserRegister):
    if user.username in fake_users_db:
        raise HTTPException(status_code=400, detail="Usuario ya existe")

    fake_users_db[user.username] = {
        "username": user.username,
        "password_hash": get_password_hash(user.password),
        "data": UserData().dict()
    }
    return {"message": "Usuario registrado"}

# Login
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or not verify_password(form_data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": form_data.username},
        expires_delta=access_token_expires
    )
    return {"access_token": token, "token_type": "bearer"}

# Obtener progreso (protegido)
@router.get("/progress")
def get_progress(current_user=Depends(get_current_user)):
    return current_user["data"]

# Actualizar progreso (protegido)
@router.post("/progress")
def update_progress(score: int, word: str, current_user=Depends(get_current_user)):
    current_user["data"]["score"] += score
    current_user["data"]["words"].append(word)
    return {"message": "Progreso actualizado", "data": current_user["data"]}
