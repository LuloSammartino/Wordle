import styles from './Word.module.css';
import { useState, useRef, useEffect } from 'react';
import useActiveWordStore from '../Store/activeWord';

function Word({ index }) {

const activeWord = useActiveWordStore(state => state.activeWord);
const [actualLetter, setActualLetter] =  useState(0) ;
const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];
const nextWord = useActiveWordStore(state => state.Next);

useEffect(() => {
    inputRefs[actualLetter].current.focus();
}, [actualLetter]);

const handlechange = (e) => {
    

    if(e.key === "Enter"){
        nextWord();
        inputRefs[0].current.focus();
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
                className={ `${styles.letter} ${(actualLetter === i && activeWord === index)? styles.active : ""}`}
                onClick={ () => setActualLetter(i)}
                onKeyDown={(e) => handlechange(e)}
                ref={ref}
                disabled={activeWord == index ? false : true}>
        </input>)}
        


    </main>
)
}
export default Word;