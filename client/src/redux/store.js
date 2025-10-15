import { configureStore } from '@reduxjs/toolkit'
import { themeReducer } from '~/redux/theme/themeSlice'
import { userReducer } from '~/redux/user/userSlice'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'
import storage from 'redux-persist/lib/storage'

const rememberMe = localStorage.getItem('rememberMe') === 'true'

const rootPersistConfig = {
  key: 'root',
  storage: rememberMe ? storage : storageSession,
  whitelist: ['user']
  // blacklist: ['user'] // định nghĩa các slice KHÔNG ĐƯỢC PHÉP duy trì qua mỗi lần f5 trình duyệt
}

// Combine các reducers trong dự án của chúng ta ở đây
const reducers = combineReducers({
  user: userReducer,
  theme: themeReducer
})

const persistedReducers = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})

