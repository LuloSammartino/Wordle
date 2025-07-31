from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from spellchecker import SpellChecker
import random as rm
from typing import Literal
import unicodedata

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get("/ok")
async def ok():
    return {"message": "ok"}

class Palabra(BaseModel):
    palabra: str

class Idioma(BaseModel):
    idioma: Literal["en","es","fr","pt","de","it","ru","ar","eu","lv","nl","fa"]

idioma_actual = "es"
@app.post("/idioma/")
async def cambiar_idioma(idioma:Idioma):
    global idioma_actual
    idioma_actual = idioma.idioma
    return {"mensaje": f"Idioma cambiado a {idioma.idioma}"}

def quitar_acentos(palabra):
    return ''.join(c for c in unicodedata.normalize('NFD', palabra)
                   if unicodedata.category(c) != 'Mn')

palabra_correcta = "puto"
largo = 4
intentos = 0
letras=set()
spell = SpellChecker(language=idioma_actual)
palabras = list(spell.word_frequency.words())

palabras = [quitar_acentos(p) for p in palabras]

@app.get("/correcta")
async def mostrar_palabra_correcta():
    return {"palabra_correcta": palabra_correcta,
            "largo": largo}

@app.post("/set_palabra")
async def correcta(correcta:Palabra):
    global palabra_correcta, largo
    palabra_correcta = correcta.palabra.lower()
    largo = len(palabra_correcta)
    palabras.append(palabra_correcta)
    return {"mensaje": f"Palabra correcta actualizada a '{palabra_correcta}'"}

@app.get("/set_largo")
async def correcta_largo(largo_permitido:int | None = None):
    global largo, palabras
    largo = largo_permitido
    if largo_permitido:
        palabras = [p for p in palabras if len(p) == largo and p.isalpha()]
        if len(palabras)>=1:
            return {"mensaje": f"Largo actualizado a {largo_permitido}"}
        else:
            return{"mensaje": f"No existen palabras en pyspellchecker de largo {largo_permitido}"}
    else:
        palabras = list(spell.word_frequency.words())
        return{"mensaje": "largo libre"}

@app.get("/set_palabra/random")    
async def palabra_random():
    global palabra_correcta
    palabra_correcta = rm.choice(palabras)
    largo=len(palabra_correcta)
    return {"palabra_correcta": palabra_correcta,
            "largo": largo}

@app.get("/intento/{intento}")
async def evaluar_intento(intento:str):
    global intentos, letras
    intento = intento.lower()
    resultado = []
    if len(intento)!=largo:
        return {"largo": largo, 
                "mensaje": f"La palabra es de largo {len(intento)}, debe ser de largo {largo}"}
    if intento not in palabras:
            return{"mensaje": f"Palabra correcta debe estar en pyspellchecker"}
    else:
        for i, letra in enumerate(intento):
            if letra == palabra_correcta[i]:
                resultado.append(2)  # letra correcta en lugar correcto
                letras.add((letra,2))
            elif letra in palabra_correcta:
                resultado.append(1)  # letra en palabra pero lugar incorrecto
                letras.add((letra,1))
            else:
                resultado.append(0)  # letra incorrecta
                letras.add((letra,0))
        intentos += 1
        return {"resultado": resultado,
                "letras": letras,
                "intentos": intentos}

@app.get("/palabras")
async def validas():
    return {"palabras validas": palabras}

@app.get("/palabra/{palabra}")
async def chequeo(palabra:str):   
    letras = [letra for letra in palabra]
    return {"letras": letras}

