import styles from './Word.module.css';
import { useState, useRef, useEffect, useCallback } from 'react';
import { animate } from 'animejs';
import axios from 'axios';
import useActiveWordStore from '../../Store/activeWord';
import useLetters from '../../Store/lettersStatus';
import usePopUpStatus from '../../Store/popUpStatus';


    //Funcion que devuelve el estilo correcto depende el estado de la letra,
    //El array se define fuera de la funcion para que no se cree con cada ejecucion
    const colors = [styles.incorrect, styles.halfCorrect, styles.correct];
    function handleResultColors(e) {
         return colors[e] ?? styles.default;
    }


function Word({ index }) {
    
    // Store 
    const activeWord = useActiveWordStore(state => state.activeWord)
    const nextWord = useActiveWordStore(state => state.Next)
    const setPopUpStatus = usePopUpStatus(state => state.setPopUpStauts)
    const setLetters = useLetters(state => state.SetLetters)
    const setMessage = usePopUpStatus(state => state.setMessage)
    const setTryes = usePopUpStatus(state => state.setTryes)

    // Local Store
    const [actualLetter, setActualLetter] = useState(0)
    const [result, setResult] = useState([])
    const [letters, setLettersState] = useState(["", "", "", "", ""])

    const letterRefs = [useRef(), useRef(), useRef(), useRef(), useRef()]
    const rowRef = useRef(null)

    const isActive = activeWord === index;
    
    useEffect(() => {
        if (isActive && rowRef.current) {
            rowRef.current.focus();
        }
    }, [activeWord])

    const handlePopUp = (message, tryes) => {
        setTimeout(() => { setPopUpStatus(true) }, 500);

        setMessage(message)
        setTryes(tryes)
    }

    const shakeAnimation = useCallback(() => {
        animate(letterRefs.current, {
            translateX: [0, 10, -10, 10, -10, 0],
            duration: 500,
            easing: 'easeInOutSine'
        });
    }, []);

    const handleWord = async (word) => {

       try {
            const { data } = await axios.get(`https://wordle-fbkx.onrender.com/intento/${word}`);
            
            setResult(data.resultado);
            setLettersGlobal(data.letras);
            nextWord();

            const isWin = data.resultado.every(val => val === 2);
            if (isWin) {
                handlePopUp("¡GANASTE!", data.intentos);
            } else if (data.intentos === 5) {
                handlePopUp("¡PERDISTE!", data.intentos);
            }
        } catch (err) {
            shakeAnimation();
        }

    }

    function validateWord(array) {
        return array.every(l => l && l.trim() !== "")
    }

    const handleKeyDown = (e) => {

        if (!isActive) return;

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
            tabIndex={isActive ? 0 : -1}
            onKeyDown={handleKeyDown}
            ref={rowRef}
        >

            {letterRefs.map((ref, i) => (

                <div
                    key={i}
                    ref={ref}
                    className={`${styles.letter} 
                        ${(actualLetter === i && isActive) ? styles.active : ""}
                        ${letters[i] ? styles.filled : ""}
                        ${result.length ? handleResultColors(result[i]) : ""}`
                    }
                    onClick={() => {
                        if (isActive) {
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
