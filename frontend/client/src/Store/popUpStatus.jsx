import {create} from 'zustand';

const usePopUpStatus = create((set) => ({
    popUpStatus: false,
    message: "",
    tryes: 0,
    time: "0:00",
    score: 0,
    setPopUpStauts: (newValue) => set({popUpStatus: newValue}),
    setMessage: (newValue) => set({message: newValue}),
    setTryes: (newValue) => set({tryes: newValue}),
    setTime: (newValue) => set({time: newValue}),
    setScore: (newValue) => set({score: newValue}),
}))

export default usePopUpStatus;