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
    
        await axios.get(`http://localhost:8000/intento/${word}`)
        .then((res) => {
            console.log(res.data)
            setResult(res.data.resultado)})
        nextWord();
    
}

function validateWord (array){
    for(let i=0; i < array.length;i++)
        if(!array[i].current.value)  return false
    
    return true;
}

const handlechange = (e) => {
        

    if(e.key === "Enter"){
        //validar que todos los inputs esten llenos
        validateWord(inputRefs) ? 
        handleWord(inputRefs.map(ref => ref.current.value).concat().join('')) :
        window.alert("Debe llenar todos los campos")
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
                            ${result ? handleResultColors(result[i]) : ""}`
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