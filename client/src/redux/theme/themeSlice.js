import { createSlice } from '@reduxjs/toolkit'

//hàm xác định xem theme của system đang dùng là gì
const getSystemTheme = () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'light'
}

const initialState = {
  mode: localStorage.getItem('theme') || 'system',
  system: getSystemTheme()
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers:{
    setTheme: (state, action) => {
      state.mode = action.payload
      localStorage.setItem('theme', action.payload)
    },
    updateSystemTheme: (state) => {
      state.system = getSystemTheme()
    }
  }
})

export const { setTheme, updateSystemTheme } = themeSlice.actions
export const themeReducer = themeSlice.reducer