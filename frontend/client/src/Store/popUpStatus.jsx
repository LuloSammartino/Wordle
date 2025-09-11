import {create} from 'zustand';

const usePopUpStatus = create((set) => ({
    popUpStatus: true,
    message: "",
    tryes: 0,
    score: 0,
    setPopUpStauts: (newValue) => set({popUpStatus: newValue}),
    setMessage: (newValue) => set({message: newValue}),
    setTryes: (newValue) => set({tryes: newValue}),
    setScore: (newValue) => set({score: newValue}),
}))

export default usePopUpStatus;