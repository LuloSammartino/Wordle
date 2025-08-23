import styles from './Word.module.css';
import { useState, useRef, useEffect } from 'react';
import useActiveWordStore from '../Store/activeWord';
import axios from 'axios';

function Word({ index }) {

const activeWord = useActiveWordStore(state => state.activeWord);
const [actualLetter, setActualLetter] =  useState(0) ;
const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];
const nextWord = useActiveWordStore(state => state.Next);
const [result, setResult] = useState([])

useEffect(() => {
    inputRefs[actualLetter].current.focus();
}, [actualLetter]);

function handleResultColors (e){
    if(e == 2)
        return styles.correct;
    if(e == 1)
        return styles.halfCorrect;
    if(e == 0)
        return styles.incorrect;
}


const handleWord = async ( word ) => {
    
    axios.get(`http://localhost:8000/intento/${word}`)
    .then((res) => {
        setResult(res.data.resultado)})
}


const handlechange = (e) => {
        

    if(e.key === "Enter"){
        nextWord();
        inputRefs[0].current.focus();
        handleWord(inputRefs.map(ref => ref.current.value).concat().join(''));
    }

    if(!e.target.value) {
        
        if(actualLetter != 0){
            setActualLetter(actualLetter - 1);
        } 
        
    } else {
        if(actualLetter < 4){ 
            setActualLetter(actualLetter + 1);
        }
    }
    
}

/////// DEBUGG ONKEYDOWN  /////////////////////////////


    return (
    <main className={styles.word}>

    {inputRefs.map((ref, i) =>    
        <input  key={i}
                maxLength="1" 
                className={ `${styles.letter} 
                            ${(actualLetter === i && activeWord === index)? styles.active : ""}
                            ${result.length ? handleResultColors(result[i]) : ""}`
                }
                onClick={ () => setActualLetter(i)}
                onKeyDown={(e) => handlechange(e)}
                ref={ref}
                disabled={activeWord == index ? false : true}>
        </input>)}
        


    </main>
)
}
export default Word;