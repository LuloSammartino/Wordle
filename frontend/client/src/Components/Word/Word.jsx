import styles from './Word.module.css';
import { useState, useRef, useEffect } from 'react';
import useActiveWordStore from '../../Store/activeWord';
import useLetters from '../../Store/lettersStatus';
import usePopUpStatus from '../../Store/popUpStatus';
import axios from 'axios';
import { animate } from 'animejs';

function Word({ index }) {

    const activeWord = useActiveWordStore(state => state.activeWord)
    const nextWord = useActiveWordStore(state => state.Next)
    const setLetters = useLetters(state => state.SetLetters)
    const [actualLetter, setActualLetter] = useState(0)
    const [result, setResult] = useState([])
    const [letters, setLettersState] = useState(["", "", "", "", ""])
    const letterRefs = [useRef(), useRef(), useRef(), useRef(), useRef()]
    const rowRef = useRef(null)
    const setPopUpStatus = usePopUpStatus(state => state.setPopUpStauts)
    const setMessage = usePopUpStatus(state => state.setMessage)
    const setTryes = usePopUpStatus(state => state.setTryes)

    useEffect(() => {
        if (activeWord === index && rowRef.current) {
            rowRef.current.focus();
        }
    }, [activeWord])

    const handlePopUp = (message, tryes) => {
        setTimeout(() => { setPopUpStatus(true) }, 500);

        setMessage(message)
        setTryes(tryes)
    }

    function handleResultColors(e) {
        if (e == 2)
            return styles.correct;
        if (e == 1)
            return styles.halfCorrect;
        if (e == 0)
            return styles.incorrect;
    }

    const handleWord = async (word) => {

        await axios.get(`https://wordle-fbkx.onrender.com/intento/${word}`)
            .then((res) => {
                setResult(res.data.resultado)
                nextWord()
                setLetters(res.data.letras)
                if (res.data.intentos == 5) {
                    res.data.resultado.includes(1) || res.data.resultado.includes(0) ?
                        handlePopUp("¡PERDISTE!", res.data.intentos) : "";
                }
                if (res.data.resultado.every(e => e == 2)) {
                    handlePopUp("¡GANASTE!", res.data.intentos);
                }
            })
            .catch((err) => { animate(letterRefs.map(ref => ref.current), { translateX: [0, 10, -10, 10, -10, 0], duration: 500 }) });


    }

    function validateWord(array) {
        return array.every(l => l && l.trim() !== "")
    }

    const handleKeyDown = (e) => {

        if (activeWord !== index) return;

        switch (e.key) {
            // letras A-Z
            default:
                if (e.key.length === 1 && e.key.match(/^[a-zA-Z]$/)) {
                    const newLetters = [...letters];
                    newLetters[actualLetter] = e.key.toUpperCase();
                    setLettersState(newLetters);
                    if (actualLetter < 4) {
                        setActualLetter(actualLetter + 1);
                    }
                }
                break;
            case "Enter":
                validateWord(letters) ?
                    handleWord(letters.join('')) :
                    animate(letterRefs.map(ref => ref.current), { translateX: [0, 10, -10, 10, -10, 0], duration: 500 });
                break;
            case "Backspace":
                e.preventDefault();
                const newLetters = [...letters];
                if (newLetters[actualLetter]) {
                    newLetters[actualLetter] = "";
                    setLettersState(newLetters);
                } else if (actualLetter > 0) {
                    newLetters[actualLetter - 1] = "";
                    setLettersState(newLetters);
                    setActualLetter(actualLetter - 1);
                }
                break;
            case " ":
                e.preventDefault();
                actualLetter < 4 ? setActualLetter(actualLetter + 1) : ""
                break;
            case "ArrowLeft":
                e.preventDefault();
                actualLetter != 0 ? setActualLetter(actualLetter - 1) : ""
                break;
            case "ArrowRight":
                actualLetter < 4 ? setActualLetter(actualLetter + 1) : ""
                break;
        }

    };



    return (
        <main
            className={styles.word}
            tabIndex={activeWord === index ? 0 : -1}
            onKeyDown={handleKeyDown}
            ref={rowRef}
        >

            {letterRefs.map((ref, i) => (

                <div
                    key={i}
                    ref={ref}
                    className={`${styles.letter} 
                        ${(actualLetter === i && activeWord === index) ? styles.active : ""}
                        ${letters[i] ? styles.filled : ""}
                        ${result.length ? handleResultColors(result[i]) : ""}`
                    }
                    onClick={() => {
                        if (activeWord === index) {
                            setActualLetter(i);
                            rowRef.current && rowRef.current.focus();
                        }
                    }}
                >
                    {letters[i]}
                </div>
            ))}

        </main>
    )
}

export default Word