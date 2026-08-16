import styles from './Menu.module.css';
import { Link } from 'react-router';
import flags from '../../utils/flags';
import { useState } from 'react';

function Menu() {

const [selectedIndex, setSelectedIndex] = useState(0);



function handleLanguage(language) {
    localStorage.setItem('wordle_language', language);
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

      <Link to={'/home'} className={styles.idiom} onClick={() => handleLanguage(flags[selectedIndex].code)}>
        <img src={flags[selectedIndex].img} alt={`Idioma ${flags[selectedIndex].code}`} />
      </Link>
    
    <button className={styles.rightArrow} onClick={() => nextFlag()} ></button>

    </div>

    <div className={styles.authRow}>
      <Link className={styles.authBtn} to={"/login"}>
        Iniciar sesión
      </Link>
    </div>
    
    
  </main>
  
}

export default Menu;
