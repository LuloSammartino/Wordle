import styles from './PopUp.module.css'
import usePopUpStatus from '../../Store/popUpStatus';
import useCorrectWordStore from '../../Store/correctWord';


const PopUp = (props) => {

    const correctWord = useCorrectWordStore(state => state.correctWord)
    const message = usePopUpStatus(state => state.message)
    const tryes = usePopUpStatus(state => state.tryes)
    const setPopUpStatus = usePopUpStatus(state => state.setPopUpStauts)
    const minuts = Math.floor(props.time / 60) ;
    const seconds = props.time % 60 ;

    return (
        <div className={styles.popupContainer}>
            <button onClick={(e) => {setPopUpStatus(false)}} className={styles.cross}>X</button>
            <h2 className={styles.message}>{message}</h2>
            <h3>La palabra era:   {" "}
                <p>{correctWord.toUpperCase()}</p>
            </h3>
            <h5>intentos: {tryes}</h5>
            <h5>Tiempo: {minuts}:{seconds}</h5>
            <h5>Score: 96</h5>
            <section className={styles.buttonContainer}>
            <button onClick={() => location.reload()}>Jugar de nuevo</button>
            </section>

        </div>
            )
        }

export default PopUp;            