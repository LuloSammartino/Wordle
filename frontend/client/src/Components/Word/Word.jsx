import styles from './Word.module.css';
import { useState, useRef, useEffect, createRef } from 'react';
import useActiveWordStore from '../../Store/activeWord';
import useLetters from '../../Store/lettersStatus';
import usePopUpStatus from '../../Store/popUpStatus';
import axios from 'axios';
import {animate} from 'animejs';

function Word({index})  {

const activeWord = useActiveWordStore(state => state.activeWord)
const nextWord = useActiveWordStore(state => state.Next)
const setLetters = useLetters(state => state.SetLetters)
const [actualLetter, setActualLetter] =  useState(0) 
const [result, setResult] = useState([])
const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()]
const setPopUpStatus = usePopUpStatus(state => state.setPopUpStauts)
const setMessage = usePopUpStatus(state => state.setMessage)
const setTryes = usePopUpStatus(state => state.setTryes)

useEffect(() => {  
    inputRefs[actualLetter].current.focus();
}, [actualLetter])

useEffect(() =>{
    inputRefs[actualLetter].current.focus();
}, [activeWord])

const handlePopUp = (message, tryes) => {
    setTimeout(() => {setPopUpStatus(true)}, 500);
    
    setMessage(message)
    setTryes(tryes)
}

function handleResultColors (e){
    if(e == 2)
        return styles.correct;
    if(e == 1)
        return styles.halfCorrect;
    if(e == 0)
        return styles.incorrect;
}

const handleWord = async ( word ) => {
    
        await axios.get(`https://wordle-fbkx.onrender.com/${word}`)
        .then((res) => {
                setResult(res.data.resultado)
                nextWord()
                setLetters(res.data.letras)
                if(res.data.intentos == 5){
                    res.data.resultado.includes(1) || res.data.resultado.includes(0) ?
                    handlePopUp("¡PERDISTE!", res.data.intentos): "" ;
                }
                if(res.data.resultado.every(e => e == 2)){
                    handlePopUp("¡GANASTE!", res.data.intentos) ;
                }
        })
        .catch((err) => {animate(inputRefs.map(ref => ref.current), {translateX: [0, 10, -10, 10, -10, 0], duration: 500})});
        
    
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
            validateWord(inputRefs) ?
            handleWord(inputRefs.map(ref => ref.current.value).join('')) :
            animate(inputRefs.map(ref => ref.current), {translateX: [0, 10, -10, 10, -10, 0], duration: 500});
        break;
        case "Backspace": 
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
                placeholder=" " 
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