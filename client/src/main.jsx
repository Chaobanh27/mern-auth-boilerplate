import { createRoot } from 'react-dom/client'
import '~/index.css'
import App from '~/App.jsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)

import { injectStore } from '~/utils/authorizedAxios'
injectStore(store)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter basename='/'>
        <App />
        <ToastContainer position='bottom-center' theme='colored' />
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
