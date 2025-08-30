import styles from './Keyboard.module.css';
import useLetters from '../../Store/lettersStatus';


const letters = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M']
];

const handleKeyColors = (e) => {
    let letter = e.toLowerCase()
    const lettersStatus = useLetters(state => state.letters)

    if(lettersStatus[letter] == 2)
        return styles.right;
    if(lettersStatus[letter] == 1)
        return styles.almostRight;
    if(lettersStatus[letter] == 0)
        return styles.wrong;

    
}



function Keyboard()  {
    return (
        <main className={styles.keyboard}>
            {letters.map((row, rowIndex) => (
                <div key={rowIndex} className={styles.keyboardRow}>
                    {row.map((letter) => (
                        <button key={letter} className={`${styles.key}
                        ${handleKeyColors(letter)}`}>
                            {letter}
                        </button>
                    ))}
                </div>
            ))}
        </main>
    );
}

export default Keyboard;