import styles from './Word.module.css';
import { useState } from 'react';

function Word() {


const [actualLetter, setActualLetter] = useState("1")
const [actualWord, setActualWord] = useState("arbol")


    return (
    <main className={styles.word}>
    
        <div className={ `${styles.letter} ${actualLetter === "1" ? styles.active : ""}`} 
        onClick={ () => setActualLetter("1")} >{actualWord[0]} 
        </div>
        <div className={ `${styles.letter} ${actualLetter === "2" ? styles.active : ""}`}
        onClick={ () => setActualLetter("2")}>{actualWord[1]}</div>
        <div className={ `${styles.letter} ${actualLetter === "3" ? styles.active : ""}`}
        onClick={ () => setActualLetter("3")}>{actualWord[2]}</div>
        <div className={ `${styles.letter} ${actualLetter === "4" ? styles.active : ""}`}
        onClick={ () => setActualLetter("4")}>{actualWord[3]}</div>
        <div className={ `${styles.letter} ${actualLetter === "5" ? styles.active : ""}`}
        onClick={ () => setActualLetter("5")}>{actualWord[4]}</div>

    </main>
)
}
export default Word;