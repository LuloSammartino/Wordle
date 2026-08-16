import styles from "./Keyboard.module.css";
import useLetters from "../../Store/lettersStatus";

const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

function Keyboard({ disabled = false }) {
    const lettersStatus = useLetters((state) => state.letters);

    const colorClass = (letter) => {
        const state = lettersStatus[letter.toLowerCase()];
        if (state === 2) return styles.right;
        if (state === 1) return styles.almostRight;
        if (state === 0) return styles.wrong;
        return "";
    };

    const pressKey = (key) => {
        const target = document.activeElement;
        target?.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
    };

    return (
        <div className={styles.keyboard} aria-label="Teclado virtual">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className={styles.keyboardRow}>
                    {row.map((letter) => (
                        <button
                            type="button"
                            key={letter}
                            className={`${styles.key} ${colorClass(letter)}`}
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => pressKey(letter)}
                            disabled={disabled}
                            aria-label={letter === "Backspace" ? "Borrar" : letter}
                        >
                            {letter === "Backspace" ? "⌫" : letter}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Keyboard;
