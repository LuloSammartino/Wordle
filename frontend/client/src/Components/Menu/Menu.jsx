import styles from './Menu.module.css';
import axios from 'axios';
import { Link } from 'react-router';
import flags from '../../utils/flags';
import { useState } from 'react';

function Menu() {

const [selectedIndex, setSelectedIndex] = useState(0);

//Envia el lenguaje seleccionado al backend
async function handleLanguage(e)   {
    await axios.get(`https://wordle-fbkx.onrender.com/idioma/${e}`)
  ;
}

const previousFlag = () => {
 setSelectedIndex((prev) => (prev - 1 + flags.length) % flags.length);
}

const nextFlag = () => {
 setSelectedIndex((prevIndex) => (prevIndex + 1) % flags.length);   
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

            <div className={styles.authRow}>
              <Link className={styles.authBtn} to={"/login"}>Iniciar sesión</Link>
            </div>
  
      </main>  
    
}

export default Menu;
