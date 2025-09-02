import styles from './PopUp.module.css'
import usePopUpStatus from '../../Store/popUpStatus';

const PopUp = () => {

    const message = usePopUpStatus(state => state.message)
    const tryes = usePopUpStatus(state => state.tryes)

    return (
        <div className={styles.popupContainer}>
            <h2 className={styles.message}>{message}</h2>
            <h5>intentos: {tryes}</h5>
            <h5>Tiempo: 1:36</h5>
            <h5>Score: 96</h5>
            <button onClick={() => location.reload()}>Jugar de nuevo</button>
        </div>
            )
        }

export default PopUp;            