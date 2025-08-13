import styles from './Word.module.css';
import { useState, useRef } from 'react';

function Word() {

const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];
const [actualLetter, setActualLetter] = useState(1)
const [actualWord, setActualWord] = useState("arbol")

const handlechange = (e) => {
    if(!e.target.value){
        
        actualLetter != 1 ? setActualLetter(actualLetter - 1) (inputRefs[actualLetter - 2 ].current.focus()) : ""
        
    } else {
        actualLetter < 5 ? setActualLetter(actualLetter + 1) (inputRefs[actualLetter].current.focus())  : ""
    }
}

    return (
    <main className={styles.word}>
    
        <input maxLength="1" className={ `${styles.letter} ${actualLetter === 1 ? styles.active : ""}`} 
        onClick={ () => setActualLetter(1)}
        onKeyUp={(e) => handlechange(e)}
        ref={inputRefs[0]}> 
        </input>

        <input maxLength="1" className={ `${styles.letter} ${actualLetter === 2 ? styles.active : ""}`}
        onClick={ () => setActualLetter(2)}
        onKeyUp={(e) => handlechange(e)}
        ref={inputRefs[1]}>
        </input>

        <input maxLength="1" className={ `${styles.letter} ${actualLetter === 3 ? styles.active : ""}`}
        onClick={ () => setActualLetter(3)}
        onKeyUp={(e) => handlechange(e)}
        ref={inputRefs[2]}>
        </input>

        <input maxLength="1" className={ `${styles.letter} ${actualLetter === 4 ? styles.active : ""}`}
        onClick={ () => setActualLetter(4)}
        onKeyUp={(e) => handlechange(e)}
        ref={inputRefs[3]}>
        </input>

        <input maxLength="1" className={ `${styles.letter} ${actualLetter === 5 ? styles.active : ""}`}
        onClick={ () => setActualLetter(5)}
        onKeyUp={(e) => handlechange(e)}
        ref={inputRefs[4]}>

        </input>

    </main>
)
}
export default Word;