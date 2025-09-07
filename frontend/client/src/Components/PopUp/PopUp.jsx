import styles from './PopUp.module.css'
import usePopUpStatus from '../../Store/popUpStatus';
import useCorrectWordStore from '../../Store/correctWord';

const PopUp = () => {

    const correctWord = useCorrectWordStore(state => state.correctWord)
    const message = usePopUpStatus(state => state.message)
    const tryes = usePopUpStatus(state => state.tryes)

    return (
        <div className={styles.popupContainer}>
            <h2 className={styles.message}>{message}</h2>
            <h3>La palabra era:   {" "}
                <p>{correctWord.toUpperCase()}</p>
            </h3>
            <h5>intentos: {tryes}</h5>
            <h5>Tiempo: 1:36</h5>
            <h5>Score: 96</h5>
            <section className={styles.buttonContainer}>
            <button onClick={() => location.reload()}>Jugar de nuevo</button>
            </section>

        </div>
            )
        }

export default PopUp;            