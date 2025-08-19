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
          
          <Word indice={0}></Word>
          <Word indice={1}></Word>
          <Word indice={2}></Word>
          <Word indice={3}></Word>
          <Word indice={4}></Word>
        </div>
      </section>
      

      <footer className={styles.footerApp}>
        <Keyboard></Keyboard>
      </footer>
    </>
  )
}

export default App
