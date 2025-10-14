import styles from './Menu.module.css';
import axios from 'axios';
import { Link } from 'react-router';
import flags from '../../utils/flags';
import { useState } from 'react';

function Menu() {

const [selectedIndex, setSelectedIndex] = useState(0);



async function handleLanguage(e)   {
    await axios.get(`https://wordle-fbkx.onrender.com/idioma/${e}`)
  ;
}

const previousFlag = () => {
    
    if(selectedIndex == 0){
        setSelectedIndex(flags.length -1);
    } else {
        setSelectedIndex(selectedIndex -1);
    }
}

const nextFlag = () => {
    
    if(selectedIndex == flags.length -1){
        setSelectedIndex(0);
    } else {
        setSelectedIndex(selectedIndex +1);
    }

    
}


  return <main className={styles.mainContainer}>

      <h2 className={styles.tittle}>SELECCIONE EL IDIOMA </h2>

    <div className={styles.menuContainer}>

    <button className={styles.leftArrow} onClick={() => previousFlag()} ></button>

      <Link to={'/home'} className={styles.idiom} onClick={(e) => handleLanguage(flags[selectedIndex].code)} >  
        <img src={flags[selectedIndex].img} />    
      </Link>
    
    <button className={styles.rightArrow} onClick={() => nextFlag()} ></button>

    </div>
    
    
  </main>
  
}

export default Menu;