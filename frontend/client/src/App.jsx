import Word from "./Word/Word"
import styles from './App.module.css';
import Keyboard from "./Keyboard/Keyboard";

function App() {
  
  
  return (

    <>
      <header className={styles.headerApp}>
        <h1>WORLDE PARA PUTOS</h1>
      </header>

      <section className={styles.content}>
        <div className={styles.wordsContainer}>
          <Word></Word>
          <Word></Word>
          <Word></Word>
          <Word></Word>
          <Word></Word>
        </div>
      </section>
      

      <footer className={styles.footerApp}>
        <Keyboard></Keyboard>
      </footer>
    </>
  )
}

export default App
