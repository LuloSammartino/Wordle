import Word from "./Components/Word/Word"
import styles from './App.module.css';
import Keyboard from "./Components/Keyboard/Keyboard";
import { useEffect , useState } from "react";
import axios from "axios";
import useCorrectWordStore from "./Store/correctWord";
import PopUp from "./Components/PopUp/PopUp";
import usePopUpStatus from "./Store/popUpStatus";
import { Link } from 'react-router';
import flags from "./utils/flags";

function App() {

const [actualSize, setActualSize] =  useState(5) ;
const setCorrecta = useCorrectWordStore(state => state.SetNewCorrect);
const popUpStatus = usePopUpStatus(state => state.popUpStatus)
const [second, setSeconds] = useState(0);

useEffect(() => {

  if(popUpStatus) return;

  const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
      
  }, 1000);
  
  return () => clearInterval(interval);
}, [second]);

useEffect(() => {
  axios.get(`https://wordle-fbkx.onrender.com/reset`)
  .then(res => { setCorrecta(res.data.palabra_correcta)})
},[])




  return (

    <>
      <header className={styles.headerApp}>

      <Link to={'/'} >
      <button className={styles.language}>🌐</button>  
      </Link>
      
        
        <h1>EL WORDLE MAS DIFICIL DEL MUNDO</h1>
        {/* <select onChange={(e) => handleSize(e)} > 
          <option value="1" >1</option>
          <option value="2" >2</option>
          <option value="3" >3</option>
          <option value="4" >4</option>
          <option value="5" selected>5</option>
          <option value="6" >6</option>
          <option value="7" >7</option>
          <option value="8" >8</option>
          <option value="9" >9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
          <option value="21">21</option>
        </select> */}
      </header>

      <section className={styles.content}>
        <div className={styles.wordsContainer}>
          <Word index={0} size={actualSize}></Word>
          <Word index={1} size={actualSize}></Word>
          <Word index={2} size={actualSize}></Word>
          <Word index={3} size={actualSize}></Word>
          <Word index={4} size={actualSize}></Word>
        </div>
      </section>
      
      {popUpStatus ? <PopUp time={second}></PopUp> : "" }
      
      <footer className={styles.footerApp}>
        <Keyboard></Keyboard>
      </footer>
    </>
  )
}

export default App;
