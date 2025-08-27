import {create} from 'zustand';

const useCorrectWordStore = create((set) => ({
    correctWord: "",
    SetNewCorrect: (newValue) => set({correctWord: newValue}),
}))


export default useCorrectWordStore; 

