import { createRef, useEffect, useRef, useState } from "react";
import axios from "axios";
import { animate } from "animejs";

import styles from "./Word.module.css";
import useActiveWordStore from "../../Store/activeWord";
import useCorrectWordStore from "../../Store/correctWord";
import useLetters from "../../Store/lettersStatus";
import usePopUpStatus from "../../Store/popUpStatus";

const apiBaseUrl = import.meta.env.VITE_API_URL;

function Word({ index, size, gameId }) {
    const activeWord = useActiveWordStore((state) => state.activeWord);
    const nextWord = useActiveWordStore((state) => state.Next);
    const setLetters = useLetters((state) => state.SetLetters);
    const setCorrectWord = useCorrectWordStore((state) => state.SetNewCorrect);
    const setPopUpStatus = usePopUpStatus((state) => state.setPopUpStauts);
    const setMessage = usePopUpStatus((state) => state.setMessage);
    const setTryes = usePopUpStatus((state) => state.setTryes);
    const [actualLetter, setActualLetter] = useState(0);
    const [result, setResult] = useState([]);
    const [letters, setLettersState] = useState(() => Array(size).fill(""));
    const [submitting, setSubmitting] = useState(false);
    const letterRefs = useRef([]);
    const rowRef = useRef(null);

    if (letterRefs.current.length !== size) {
        letterRefs.current = Array.from(
            { length: size },
            (_, position) => letterRefs.current[position] ?? createRef(),
        );
    }

    useEffect(() => {
        setLettersState(Array(size).fill(""));
        setActualLetter(0);
        setResult([]);
    }, [gameId, size]);

    useEffect(() => {
        if (activeWord === index) rowRef.current?.focus();
    }, [activeWord, index]);

    const shake = () => animate(
        letterRefs.current.map((ref) => ref.current),
        { translateX: [0, 10, -10, 10, -10, 0], duration: 500 },
    );

    const submitWord = async () => {
        if (!gameId || submitting) return;
        setSubmitting(true);
        try {
            const response = await axios.post(`${apiBaseUrl}/games/${gameId}/attempts`, {
                word: letters.join(""),
            });
            const data = response.data;
            setResult(data.result);
            setLetters(data.letters);

            if (data.status === "playing") {
                nextWord();
            } else {
                setCorrectWord(data.correct_word);
                setMessage(data.status === "won" ? "¡GANASTE!" : "¡PERDISTE!");
                setTryes(data.attempts);
                setTimeout(() => setPopUpStatus(true), 500);
            }
        } catch {
            shake();
        } finally {
            setSubmitting(false);
        }
    };

    const handleKeyDown = (event) => {
        if (activeWord !== index || submitting || result.length) return;

        if (event.key === "Enter") {
            if (letters.every(Boolean)) submitWord();
            else shake();
            return;
        }

        if (event.key === "Backspace") {
            event.preventDefault();
            const nextLetters = [...letters];
            if (nextLetters[actualLetter]) nextLetters[actualLetter] = "";
            else if (actualLetter > 0) {
                nextLetters[actualLetter - 1] = "";
                setActualLetter(actualLetter - 1);
            }
            setLettersState(nextLetters);
            return;
        }

        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            const direction = event.key === "ArrowLeft" ? -1 : 1;
            setActualLetter((position) => Math.max(0, Math.min(size - 1, position + direction)));
            return;
        }

        if (/^\p{L}$/u.test(event.key)) {
            const nextLetters = [...letters];
            nextLetters[actualLetter] = event.key.toUpperCase();
            setLettersState(nextLetters);
            setActualLetter((position) => Math.min(size - 1, position + 1));
        }
    };

    const colorClass = (state) => {
        if (state === 2) return styles.correct;
        if (state === 1) return styles.halfCorrect;
        if (state === 0) return styles.incorrect;
        return "";
    };

    return (
        <div
            className={styles.word}
            tabIndex={activeWord === index ? 0 : -1}
            onKeyDown={handleKeyDown}
            ref={rowRef}
            role="group"
            aria-label={`Intento ${index + 1}`}
        >
            {letterRefs.current.map((ref, position) => (
                <div
                    key={position}
                    ref={ref}
                    className={`${styles.letter}
                        ${actualLetter === position && activeWord === index ? styles.active : ""}
                        ${letters[position] ? styles.filled : ""}
                        ${result.length ? colorClass(result[position]) : ""}`}
                    onClick={() => {
                        if (activeWord === index) {
                            setActualLetter(position);
                            rowRef.current?.focus();
                        }
                    }}
                >
                    {letters[position]}
                </div>
            ))}
        </div>
    );
}

export default Word;
