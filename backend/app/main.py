from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

class LetraInput(BaseModel):
    letra: str

@app.get("/")
def read_root():
    return {"mensaje": "Servidor FastAPI funcionando"}

@app.post("/letra")
async def process_letra(input_data: LetraInput):
    letra = input_data.letra
    # Here you would process the letra as needed
    # For demonstration, we will just return it back
    return {"processed_letra": letra}


@app.post("/jugar")
def jugar(letra: LetraInput):
    # Aquí iría tu lógica de validación de letra, estado del juego, etc.
    if letra.letra.lower() in "palabra":  # Ejemplo de palabra
        return {"resultado": "acierto", "letra": letra.letra}
    else:
        return {"resultado": "error", "letra": letra.letra}