from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from spellchecker import SpellChecker
import random as rm
from typing import Literal
import unicodedata

app = FastAPI()

app.add_middleware(            # esto hay que revisarlo para producción
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

def quitar_acentos(palabra):
    return ''.join(c for c in unicodedata.normalize('NFD', palabra)
                if unicodedata.category(c) != 'Mn')

palabra_correcta = "arbol"
idioma_actual = "es"       
largo_actual = 5
intentos = 0
letras = {"a":4,"b":4,"c":4,"d":4,"e":4,"f":4,"g":4,"h":4,"i":4,"j":4,"k":4,"l":4,"m":4,"n":4,"ñ":4,"o":4,"p":4,"q":4,"r":4,"s":4,"t":4,"u":4,"v":4,"w":4,"x":4,"y":4,"z":4}

palabras = list(SpellChecker(language=idioma_actual).word_frequency.words())
palabras = [quitar_acentos(p) for p in palabras] # averiguar como sacar los tildes pero no las ñ

@app.get("/idioma/{idioma}")
async def cambiar_idioma(idioma: Literal["en","es","fr","pt","de","it","ru","ar","eu","lv","nl","fa"]):
    """ Cambia el idioma del diccionario """
    global idioma_actual, palabras
    idioma_actual = idioma
    palabras = list(SpellChecker(language=idioma).word_frequency.words())
    palabras = [quitar_acentos(p) for p in palabras]
    return {"mensaje": f"Idioma cambiado a {idioma}"}

def new_game():
    """Inicia un nuevo juego"""
    global palabra_correcta, largo_actual, intentos, letras
    palabra_correcta = rm.choice([p for p in palabras if len(p) == 5 and p.isalpha()])
    largo_actual = 5
    intentos = 0
    letras = {"a":4,"b":4,"c":4,"d":4,"e":4,"f":4,"g":4,"h":4,"i":4,"j":4,"k":4,"l":4,"m":4,"n":4,"ñ":4,"o":4,"p":4,"q":4,"r":4,"s":4,"t":4,"u":4,"v":4,"w":4,"x":4,"y":4,"z":4}

@app.on_event("startup")
def startup_event():
    """ Evento que se ejecuta al iniciar la aplicación """
    new_game()

@app.get("/reset")
def reset_game():
    """Resetea la partida"""
    new_game()
    return {"palabra_correcta": palabra_correcta,
            "largo_actual": largo_actual,
            "message": "Nuevo juego iniciado"}

@app.get("/correcta")
async def mostrar_palabra_correcta():
    """ Muestra la palabra correcta actual y su largo """
    return {"palabra_correcta": palabra_correcta,
            "largo_actual": largo_actual}

@app.post("/set_palabra")
async def correcta(correcta:Palabra):
    """ Establece la palabra correcta """
    global palabra_correcta, largo_actual
    palabra_correcta = correcta.palabra.lower()
    largo_actual = len(palabra_correcta)
    palabras.append(palabra_correcta)
    return {"mensaje": f"Palabra correcta actualizada a '{palabra_correcta}'"}

@app.get("/set_palabra/random")    
async def palabra_random(largo:int | None = largo_actual):
    """ Establece una palabra correcta aleatoria de un largo dado (o el actual si no se da) """
    global palabra_correcta, largo_actual, palabras
    if largo:
        posibles_palabras = [p for p in palabras if len(p) == largo and p.isalpha()]
        if len(posibles_palabras)<1:
            return{"mensaje": f"No existen palabras en pyspellchecker de largo {largo}"}    # esto por ahora no pasa (elige entre 1 y 16)
    palabra_correcta = rm.choice(posibles_palabras)
    largo_actual = len(palabra_correcta)
    return {"palabra_correcta": palabra_correcta,
            "largo_actual": largo_actual}

@app.get("/intento/{intento}")
async def evaluar_intento(intento:str):
    """ Evalua un intento y devuelve el resultado """
    global intentos, letras
    intento = intento.lower()
    resultado = []
    if intento not in palabras:
        raise HTTPException(status_code=404, detail = "La palabra debe estar en spellchecker")
    else: 
        borrador = list(palabra_correcta)
        for i, letra in enumerate(intento):
            if letra == palabra_correcta[i]:
                resultado.append(2)  # letra correcta en lugar correcto
                letras[letra] = 2
                borrador.remove(letra)  
            else:
                resultado.append(0)
        
        for i, letra in enumerate(intento):
            if resultado[i] == 2:
                continue
            elif resultado[i] == 0:
                if letra in borrador:
                    resultado[i] = 1   # letra en palabra pero lugar incorrecto
                    if letras[letra] == 2:
                        pass
                    else:
                        letras[letra] = 1
                    borrador.remove(letra)
                else:
                    letras[letra] = 0
                    continue  # letra no esta en la palabra
        
        intentos += 1
        return {"resultado": resultado,
                "letras": letras,
                "intentos": intentos}


@app.get("/palabras/")
async def validas(validas: bool = True, largo: int | None = None):
    """ Devuelve las palabras válidas (o todas) de un largo dado (o el actual si no se da) """
    if not largo:
        if validas:
            palabras_validas = [p for p in palabras if len(p) == largo_actual and p.isalpha()]
            return {"palabras_validas": palabras_validas}
        else: 
            return {"palabras": palabras}
    else:
        palabras_largo = [p for p in palabras if len(p) == largo and p.isalpha()]
        return {"palabras_largo": palabras_largo}


@app.get("/palabra/{palabra}")
async def chequeo(palabra:str):   
    letras = [letra for letra in palabra]
    return {"letras": letras}

