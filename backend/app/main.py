from __future__ import annotations

from contextlib import asynccontextmanager
from functools import lru_cache
import logging
import random
import threading
import time
import unicodedata
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from spellchecker import SpellChecker

from .database import close_db_pool, init_db_pool
from .register import router as user_router

logger = logging.getLogger(__name__)
SUPPORTED_LANGUAGES = {"en", "es", "fr", "pt", "de", "it", "ru", "ar", "nl"}
MAX_ATTEMPTS = 5
GAME_TTL_SECONDS = 4 * 60 * 60
games: dict[str, "Game"] = {}
games_lock = threading.Lock()


class NewGameRequest(BaseModel):
    language: str = "es"
    length: int = Field(default=5, ge=3, le=16)


class AttemptRequest(BaseModel):
    word: str = Field(min_length=1, max_length=32)


class Game:
    def __init__(self, answer: str, language: str):
        self.answer = answer
        self.language = language
        self.attempts = 0
        self.finished = False
        self.letters: dict[str, int] = {}
        self.created_at = time.monotonic()


def normalize_word(word: str) -> str:
    """Lowercase and remove accents while preserving Spanish ñ."""
    word = word.strip().lower().replace("ñ", "\0")
    word = "".join(
        char
        for char in unicodedata.normalize("NFD", word)
        if unicodedata.category(char) != "Mn"
    )
    return word.replace("\0", "ñ")


@lru_cache(maxsize=len(SUPPORTED_LANGUAGES))
def words_for(language: str) -> tuple[str, ...]:
    words = {
        normalize_word(word)
        for word in SpellChecker(language=language).word_frequency.words()
    }
    return tuple(word for word in words if word.isalpha())


def evaluate(answer: str, attempt: str) -> list[int]:
    result = [0] * len(answer)
    remaining = list(answer)

    for index, letter in enumerate(attempt):
        if letter == answer[index]:
            result[index] = 2
            remaining[index] = ""

    for index, letter in enumerate(attempt):
        if result[index] == 0 and letter in remaining:
            result[index] = 1
            remaining[remaining.index(letter)] = ""

    return result


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        init_db_pool()
    except Exception as exc:
        logger.warning("Oracle no disponible; el juego anónimo seguirá funcionando: %s", exc)
    yield
    close_db_pool()


app = FastAPI(title="WORLDE API", lifespan=lifespan)
app.include_router(user_router, prefix="/user", tags=["users"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://wordle-front-y7gp.onrender.com",
        "https://wordle-front.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.get("/ok")
def ok():
    return {"message": "ok"}


@app.post("/games", status_code=201)
def create_game(request: NewGameRequest):
    language = request.language.lower()
    if language not in SUPPORTED_LANGUAGES:
        raise HTTPException(status_code=422, detail="Idioma no soportado")

    candidates = [word for word in words_for(language) if len(word) == request.length]
    if not candidates:
        raise HTTPException(status_code=422, detail="No hay palabras para ese idioma y longitud")

    game_id = uuid4().hex
    with games_lock:
        cutoff = time.monotonic() - GAME_TTL_SECONDS
        for expired_id in [key for key, game in games.items() if game.created_at < cutoff]:
            del games[expired_id]
        games[game_id] = Game(random.choice(candidates), language)

    return {"game_id": game_id, "length": request.length, "max_attempts": MAX_ATTEMPTS}


@app.post("/games/{game_id}/attempts")
def submit_attempt(game_id: str, request: AttemptRequest):
    attempt = normalize_word(request.word)

    with games_lock:
        game = games.get(game_id)
        if game is None:
            raise HTTPException(status_code=404, detail="Partida no encontrada")
        if game.finished:
            raise HTTPException(status_code=409, detail="La partida ya terminó")
        if len(attempt) != len(game.answer):
            raise HTTPException(status_code=422, detail="La palabra tiene un largo incorrecto")
        if attempt not in words_for(game.language):
            raise HTTPException(status_code=422, detail="La palabra no está en el diccionario")

        result = evaluate(game.answer, attempt)
        game.attempts += 1
        for letter, state in zip(attempt, result):
            game.letters[letter] = max(game.letters.get(letter, -1), state)

        won = all(state == 2 for state in result)
        game.finished = won or game.attempts >= MAX_ATTEMPTS
        status = "won" if won else "lost" if game.finished else "playing"
        response = {
            "result": result,
            "letters": game.letters,
            "attempts": game.attempts,
            "status": status,
        }
        if game.finished:
            response["correct_word"] = game.answer
        return response
