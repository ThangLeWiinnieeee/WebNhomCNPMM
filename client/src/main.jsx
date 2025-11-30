import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { BrowserRouter } from 'react-router-dom'
import { store, persistor } from './stores/store.js'
import { Toaster } from 'sonner';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './assets/css/global.css';
import './assets/css/sonner-custom.css';

import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
          <Toaster 
            position="top-right" 
            richColors 
            expand={true}
            duration={1000}
          />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
