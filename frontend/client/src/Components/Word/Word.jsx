import styles from './Word.module.css';
import { useState, useRef, useEffect, createRef } from 'react';
import useActiveWordStore from '../../Store/activeWord';
import useCorrectWordStore from '../../Store/correctWord';
import axios from 'axios';

function Word({index})  {

const activeWord = useActiveWordStore(state => state.activeWord);
const [actualLetter, setActualLetter] =  useState(0) ;
const nextWord = useActiveWordStore(state => state.Next);
const correct = useCorrectWordStore(state => state.correctWord);
const [result, setResult] = useState([])
const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];

useEffect(() => {  
    inputRefs[actualLetter].current.focus();
}, [actualLetter]);

useEffect(() =>{
    inputRefs[actualLetter].current.focus();
}, [activeWord])



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
                setResult(res.data.resultado);
                nextWord()
                if(res.data.intentos == 5){
                    res.data.resultado.includes(1) || res.data.resultado.includes(0) ? window.alert(`Perdiste, la palabra era ${correct}`) : "" ;
                } 
        })
        .catch((err) => {window.alert(err.response.data.detail)});
        
    
}

function validateWord (array){
    for(let i=0; i < array.length;i++)
        if(!array[i].current.value)  return false
    
    return true;
}

const handleInputChange = (e) => {

    const value = e.target.value;

    if (!value) {
        actualLetter != 0 ? setActualLetter(actualLetter - 1) : "" ;    
    } else{
        if(value.match(/^[a-zA-Z]?$/)){
            actualLetter < 4 ? setActualLetter(actualLetter + 1) : ""
        } else e.target.value = "";   
    }
    
};


const handleKeyDown = (e) => {

    if(e.key.match(/^[a-zA-Z]?$/) &&  e.target.value && actualLetter < 4){
            setActualLetter(actualLetter + 1)
    }
    
    switch (e.key){
        case "Enter":
            if(validateWord(inputRefs)) {
            handleWord(inputRefs.map(ref => ref.current.value).join(''));
        } else {
            window.alert("Debe llenar todos los campos");
        }
        break;
        case "Backspace": ////DEBUG//
            if (!inputRefs[actualLetter].current.value && actualLetter > 0) {
            setActualLetter(actualLetter - 1);
        }
        break;
        case " ":
            actualLetter < 4 ? setActualLetter(actualLetter + 1) : ""
        break;
        case "ArrowLeft":
            e.preventDefault();
            actualLetter != 0 ? setActualLetter(actualLetter - 1) : ""
        break;
        case "ArrowRight":
            actualLetter < 4 ? setActualLetter(actualLetter + 1) : ""  
    }
    
};



    return ( 
    <main className={styles.word}>

    {inputRefs.map((ref,i) => (
            
        <input  key={i}
                maxLength="1" 
                className={ `${styles.letter} 
                            ${(actualLetter === i && activeWord === index)? styles.active : ""}
                            ${result ? handleResultColors(result[i]) : ""}`
                }
                onClick={ () => setActualLetter(i) }
                onChange={ (e) => handleInputChange(e) }
                onKeyDown={ (e) => handleKeyDown(e) }
                ref={ref}
                disabled={activeWord == index ? false : true}
        />)
    )}
        


    </main>
)
}

export default Word