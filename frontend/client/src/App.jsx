import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";

import styles from "./App.module.css";
import Keyboard from "./Components/Keyboard/Keyboard";
import PopUp from "./Components/PopUp/PopUp";
import Word from "./Components/Word/Word";
import useActiveWordStore from "./Store/activeWord";
import useCorrectWordStore from "./Store/correctWord";
import useLetters from "./Store/lettersStatus";
import usePopUpStatus from "./Store/popUpStatus";

const apiBaseUrl = import.meta.env.VITE_API_URL;
const MAX_ATTEMPTS = 5;

function App() {
  const [actualSize, setActualSize] = useState(5);
  const [gameId, setGameId] = useState("");
  const [second, setSeconds] = useState(0);
  const [error, setError] = useState("");
  const popUpStatus = usePopUpStatus((state) => state.popUpStatus);
  const resetActiveWord = useActiveWordStore((state) => state.Reset);
  const resetLetters = useLetters((state) => state.Reset);
  const resetPopup = usePopUpStatus((state) => state.Reset);
  const setCorrectWord = useCorrectWordStore((state) => state.SetNewCorrect);

  const startGame = useCallback(async (length) => {
    setError("");
    setGameId("");
    setSeconds(0);
    resetActiveWord();
    resetLetters();
    resetPopup();
    setCorrectWord("");

    try {
      const language = localStorage.getItem("wordle_language") || "es";
      const response = await axios.post(`${apiBaseUrl}/games`, { language, length });
      setGameId(response.data.game_id);
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "No se pudo iniciar la partida.");
    }
  }, [resetActiveWord, resetLetters, resetPopup, setCorrectWord]);

  useEffect(() => {
    startGame(actualSize);
  }, [actualSize, startGame]);

  useEffect(() => {
    if (popUpStatus || !gameId) return undefined;
    const interval = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(interval);
  }, [gameId, popUpStatus]);

  return (
    <>
      <header className={styles.headerApp}>
        <Link to="/" aria-label="Cambiar idioma">
          <button className={styles.language} disabled={popUpStatus}>🌐</button>
        </Link>
        <h1>EL WORDLE MÁS DIFÍCIL DEL MUNDO</h1>
      </header>

      <section className={styles.content}>
        <label>
          Dificultad
          <select
            value={actualSize}
            onChange={(event) => setActualSize(Number(event.target.value))}
            className={styles.dificultad}
            disabled={popUpStatus}
          >
            <option value={5}>Normal · 5 letras</option>
            <option value={6}>Difícil · 6 letras</option>
            <option value={7}>Muy difícil · 7 letras</option>
          </select>
        </label>

        {error ? (
          <p role="alert">
            {error} <button type="button" onClick={() => startGame(actualSize)}>Reintentar</button>
          </p>
        ) : null}
        {!gameId && !error ? <p>Preparando partida…</p> : null}

        <div className={styles.wordsContainer}>
          {Array.from({ length: MAX_ATTEMPTS }, (_, index) => (
            <Word key={`${gameId}-${index}`} index={index} size={actualSize} gameId={gameId} />
          ))}
        </div>
      </section>

      {popUpStatus ? <PopUp time={second} onRestart={() => startGame(actualSize)} /> : null}

      <footer className={styles.footerApp}>
        <Keyboard disabled={!gameId || popUpStatus} />
      </footer>
    </>
  );
}

export default App;
