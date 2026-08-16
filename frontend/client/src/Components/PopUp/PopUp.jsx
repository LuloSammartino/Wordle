import styles from './PopUp.module.css'
import usePopUpStatus from '../../Store/popUpStatus';
import useCorrectWordStore from '../../Store/correctWord';
import { gifsLose, gifsWin } from '../../utils/gifs';
import { useMemo } from 'react';


const PopUp = ({ time, onRestart }) => {

    const correctWord = useCorrectWordStore(state => state.correctWord)
    const message = usePopUpStatus(state => state.message)
    const tryes = usePopUpStatus(state => state.tryes)
    const minuts = Math.floor(time / 60);
    const seconds = time % 60;
    const score = message === "¡GANASTE!" ? Math.max(0, (6 - tryes) * 20) : 0;

    const gif = useMemo(() => {
        const n = Math.floor(Math.random() * 3);
        return message === "¡GANASTE!" ? gifsWin[n] : gifsLose[n];
    }, [message]);



    return (
        <div className={styles.popupContainer}>
            <div className={styles.crossContainer}>
                <button onClick={onRestart} className={styles.cross} aria-label="Cerrar y jugar de nuevo">X</button>
            </div>
            <h2 className={styles.message}>{message}</h2>

            <article><img src={gif} alt={message} /></article>


            <h3>La palabra era:</h3>
            <p>{correctWord.toUpperCase()}</p>

            <h5>intentos: {tryes}</h5>
            <h5>Tiempo: {minuts}:{String(seconds).padStart(2, "0")}</h5>
            <h5>Score: {score}</h5>

            <section className={styles.buttonContainer}>
                <button onClick={onRestart}>Jugar de nuevo</button>
            </section>

        </div>
    )
}

export default PopUp;
