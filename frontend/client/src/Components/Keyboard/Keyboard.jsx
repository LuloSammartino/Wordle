import styles from './Keyboard.module.css';

const letters = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['Z','X','C','V','B','N','M']
];

function Keyboard()  {
    return (
        <main className={styles.keyboard}>
            {letters.map((row, rowIndex) => (
                <div key={rowIndex} className={styles.keyboardRow}>
                    {row.map((letter) => (
                        <button key={letter} className={styles.key}>
                            {letter}
                        </button>
                    ))}
                </div>
            ))}
        </main>
    );
}

export default Keyboard;