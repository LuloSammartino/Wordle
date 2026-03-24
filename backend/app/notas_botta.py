# Separación por dificultad 
# metrica length * ln(N_length) / Tries=5
# 5 niveles igual poblados

import numpy as np
import unicodedata
from spellchecker import SpellChecker
from collections import Counter

def limpiar_palabra(palabra):
    palabra = palabra.lower().strip()
    # Mapeo manual para proteger la Ñ antes de normalizar
    palabra = palabra.replace('ñ', '##N##')

    palabra = "".join(c for c in unicodedata.normalize('NFD', palabra) if unicodedata.category(c) != 'Mn')

    # Restaurar la Ñ
    return palabra.replace('##N##', 'ñ')

palabras = list(SpellChecker(language="es").word_frequency.words())
palabras = [limpiar_palabra(p) for p in palabras]

n_tries = 5
conteo_longitudes = Counter(len(p) for p in palabras)

def get_difficulty(palabra):
    same_length_count = conteo_longitudes[len(palabra)]
    return len(palabra) * np.log(same_length_count + 1) / n_tries 

data = []
for p in palabras:
    data.append({"palabra":p, "diff": get_difficulty(p)})
data.sort(key=lambda x: x["diff"])

n = len(data)
for i, item in enumerate(data):
    item["grupo"] = int(5 * i /n)  # separo en 5 grupos igual de largos

# ORACLE 
for item in data:
    sql = f"UPDATE PALABRAS SET DIFICULTAD = {item["diff"]:.2f}, GRUPO = {item['grupo']} WHERE TEXTO = '{item['palabra']}';"
    print(sql) # execute. 
    
# Hay que agregar a la bd palabras columnas dificultad y grupo 

def Puntaje(intentos, dificultad):  
    return dificultad*100*(5-intentos)

# Si no es mucho peso guardar cada palabra adivinada con su puntaje (esto no se va a poder mejorar pq no va a volver a jugarla)

###
# Calls con la BD

# mod tabla   # Intentos esta al pedo, pero para stats sirve
# ALTER TABLE PROGRESO ADD (PUNTOS_GANADOS NUMER DEFAULT 0); 

# Usuarios
# INSERT INTO USUARIOS (ID, USERNAME, PWD_HASH, SALT, EMAIL)
# VALUES (SEQ_USER_ID.NEXTVAL, :username, :hash, :salt, :email)

# Progreso
# INSERT INTO PROGRESS  (ID_USUARIO, ID_PALABRA, INTENTOS, PUNTOS_GANADOS)
# Values (:id_usuario, :id_palabra, :intentos, :puntos)

# Extraer palabras
# SELECT * FROM (SELECT ID, TEXTO FROM TABLA_PALABRAS WHERE GRUPO = :nivel_elegido
#     AND ID NOT IN (SELECT ID_PALABRA FROM PROGRESO WHERE ID_USUARIO = :id_usuario)
#     ORDER BY DBMS_RANDOM.VALUE) WHERE ROWNUM = 1;

import hashlib, os

def registro_usuario(connection, username, email, password):
    salt = os.urandom(16).hex()
    pwd_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    try:
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO USUARIO (USERNAME, PWD_HASH, SALT, EMAIL)
            VALUES (:1, :2, :3, :4)
            """
            cursor.execute(sql, [username,pwd_hash,salt,email])
            connection.commit()
            print(f"Usuario: {username} registrado.")
            return True
    except Exception as e:
        print("Error al registrar: {e}")
        return False

# usuario como token (JWT) despues del login

def guardar_progreso(connection, user_id, palabra_id, intentos, dificultad): # mejor extrar la dificultad junto con la palabra y la id al principio 
    puntos = round(dificultad*100*(5-intentos)) # o calcular el puntaje con la funcion 
    try: 
        with connection.cursor() as cursor:
            sql = """
            INSERT INTO PROGRESS (ID_USUARIO, ID_PALABRA, INTENTOS, PUNTOS_GANADOS) 
            VALUES (:1, :2, :3, :4)"""
            cursor.execute(sql, [user_id, palabra_id, intentos, puntos])
            connection.commit()
            print(f"Progreso guardado")
            return puntos
    except Exception as e:
        print(f"Error al guardar progreso {e}")
        return 0

def nueva_palabra(connection, user_id, nivel):
    try:
        with connection.cursor() as cursor:
            sql = """SELECT * FROM (
            SELECT ID, TEXTO, DIFICULTAD
            FROM PALABRAS
            WHERE GRUPO = :nivel
            AND ID NOT IN (SELECT ID_PALABRA FROM PROGRESO WHERE ID_USUARIO = :uid)
            ORDER BY DBMS_RANDOM.VALUE
            ) WHERE ROWNUM = 1"""
            cursor.execute(sql, {"nivel": nivel, "uid": user_id})
            res = cursor.fetchone()
            return {"id":res[0], "texto":res[1], "diff":res[2]} if res else None

            return True
    except Exception as e:
        print(f"Error al obtener nueva palabra {e}")
        return None