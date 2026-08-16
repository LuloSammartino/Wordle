import {create} from 'zustand';

const useActiveWordStore = create((set) => ({
    activeWord: 0,
    Next: () => set((state) => ({ activeWord: state.activeWord + 1})),
    Reset: () => set({ activeWord: 0 })
}))


export default useActiveWordStore; 

