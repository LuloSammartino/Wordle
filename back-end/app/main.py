from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"Puto el que lee"}

