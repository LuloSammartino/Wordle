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
