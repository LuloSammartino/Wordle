import styles from './PopUp.module.css'
import usePopUpStatus from '../../Store/popUpStatus';
import useCorrectWordStore from '../../Store/correctWord';
import gifLose1 from '../../assets/Lose.gif';
import gifLose2 from '../../assets/Lose2.gif';


const PopUp = (props) => {

    const gifsLose = [gifLose1, gifLose2]
    const correctWord = useCorrectWordStore(state => state.correctWord)
    const message = usePopUpStatus(state => state.message)
    const tryes = usePopUpStatus(state => state.tryes)
    const setPopUpStatus = usePopUpStatus(state => state.setPopUpStauts)
    const minuts = Math.floor(props.time / 60);
    const seconds = props.time % 60;

    function RandomGif(state) {
        const n = Math.floor(Math.random() * 2);

        if (state !== "¡GANASTE!") return gifsLose[n]
    }



    return (
        <div className={styles.popupContainer}>
            <div className={styles.crossContainer}>
                <button onClick={(e) => { setPopUpStatus(false) }} className={styles.cross}>X</button>
            </div>
            <h2 className={styles.message}>{message}</h2>

            <article><img src={RandomGif(message)} /></article>


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