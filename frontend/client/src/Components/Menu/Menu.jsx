import styles from './Menu.module.css';
import axios from 'axios';
import { Link } from 'react-router';

function Menu() {

async function handleLanguage(e)   {
   await axios.get(`https://wordle-fbkx.onrender.com/idioma/${e}`)
  ;
}

  return <main className={styles.menuContainer}>
    <Link to={'/home'}className={styles.idiom} onClick={(e) => handleLanguage("es")}>Español</Link>
    <Link to={'/home'}className={styles.idiom} onClick={() => handleLanguage("en")}>Ingles</Link>
    <Link to={'/home'}className={styles.idiom} onClick={() => handleLanguage("fr")}>Frances</Link>
    <Link to={'/home'}className={styles.idiom} onClick={() => handleLanguage("pt")}>Portugues</Link>
    <Link to={'/home'}className={styles.idiom} onClick={() => handleLanguage("it")}>Italiano</Link>
    <Link to={'/home'}className={styles.idiom} onClick={() => handleLanguage("ru")}>Ruso</Link>
    <Link to={'/home'}className={styles.idiom} onClick={() => handleLanguage("de")}>Aleman</Link>
    <Link to={'/home'}className={styles.idiom} onClick={() => handleLanguage("ar")}>Arabe</Link>
    <Link to={'/home'}className={styles.idiom} onClick={() => handleLanguage("eu")}>Vasco</Link>
    <Link to={'/home'}className={styles.idiom} onClick={() => handleLanguage("nl")}>Holandes</Link>
    <Link to={'/home'}className={styles.idiom} onClick={() => handleLanguage("fa")}>Persa</Link>
    <Link to={'/home'}className={styles.idiom} onClick={() => handleLanguage("lv")}>Letón</Link>
  </main>
  
}

export default Menu;