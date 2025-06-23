import { create } from 'zustand'
// zustand is used for creating global state - easier than react's inbuilt hooks:) 

const themeStore = create((set) => ({
  theme: localStorage.getItem('app-theme') || 'dracula',
  setTheme: (theme) => {
    localStorage.setItem('app-theme', theme),
    set({ theme })
  }
})); // returns an Object 

export default themeStore;