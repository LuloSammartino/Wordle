import styles from './PopUp.module.css'
import usePopUpStatus from '../../Store/popUpStatus'
import useCorrectWordStore from '../../Store/correctWord'
import { gifsLose, gifsWin } from '../../utils/gifs'
import {useMemo} from 'react'


const PopUp = (props) => {

    //Store
    const correctWord = useCorrectWordStore(state => state.correctWord)
    const message = usePopUpStatus(state => state.message)
    const tryes = usePopUpStatus(state => state.tryes)
    const setPopUpStatus = usePopUpStatus(state => state.setPopUpStauts)
    
    const minuts = Math.floor(props.time / 60);
    const seconds = props.time % 60;

    // Funcion que genera un gif aleatorio dependiendo si perdio o gano, se usa useMemo para que no se genere el numero con cada renderizado
    // sino con cada cambio de "message"
    const RandomGif = useMemo(() => {
        const n = Math.floor(Math.random() * 3);
        
        if (message == "¡GANASTE!") return gifsWin[n]
        else return gifsLose[n];
        }, [message])

    return (
        <div className={styles.popupContainer}>
            <div className={styles.crossContainer}>
                <button onClick={(e) => { setPopUpStatus(false) }} className={styles.cross}>X</button>
            </div>
            <h2 className={styles.message}>{message}</h2>

            <article><img src={RandomGif()} /></article>


            <h3>La palabra era:   {" "}
                <p>{correctWord.toUpperCase()}</p>
            </h3>

            <h5>intentos: {tryes}</h5>
            <h5>Tiempo: {minuts}:{seconds}</h5>
            <h5>Score: 96</h5>

            <section className={styles.buttonContainer} to={'/home'} >
                <button onClick={() => location.reload()}>Jugar de nuevo</button>
            </section>

        </div>
    )
}

export default PopUp;            
