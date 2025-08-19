import styles from './Word.module.css';
import { useState, useRef, useEffect, use } from 'react';
import useActiveWordStore from '../Store/activeWord';

function Word({ indice }) {


useEffect(() => {
    inputRefs[actualLetter].current.focus();
    
})

const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];
const [actualLetter, setActualLetter] = useState(0)

console.log( indice )

const handlechange = (e) => {
    console.log(e)
    if(!e.target.value) {
        
        actualLetter != 0 ? setActualLetter(actualLetter - 1) : ""
        
    } else {
        actualLetter < 4 ? setActualLetter(actualLetter + 1)  : ""
    }
}





    return (
    <main className={styles.word}>

    {inputRefs.map((ref, i) =>    
        <input  key={i}
                maxLength="1" 
                className={ `${styles.letter} ${actualLetter === i ? styles.active : ""}`}
                onClick={ () => setActualLetter(i)}
                onChange={(e) => handlechange(e)}
                ref={ref}
                disabled={useActiveWordStore(state => state.activeWord) == indice ? false : true}>
        </input>)}
        


    </main>
)
}
export default Word;