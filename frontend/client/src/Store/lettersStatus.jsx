import {create} from 'zustand';

const useLetters = create((set) => ({
    letters: {},
    SetLetters: (newValue) => set({letters: newValue}),
    Reset: () => set({letters: {}}),
}))

export default useLetters;
