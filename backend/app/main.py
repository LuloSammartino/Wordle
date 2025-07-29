from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dominio del frontend
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

class LetraInput(BaseModel):
    letra: str

@app.get("/ok")
async def ok():
    return {"message": "ok"}

@app.get("/palabra/")
async def chequeo(palabra: str):   
    letras = [letra for letra in palabra]
    
    return letras

@app.post("/letra/")
async def letra(input: LetraInput):
    letra = input.letra
    if len(letra) != 1:
        return {"error": "La letra debe ser un único carácter"}
    return {"letra": letra}

