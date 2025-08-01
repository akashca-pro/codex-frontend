import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '@fontsource/jetbrains-mono';
import App from './App'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store} >
      <PersistGate loading={<div className="text-white text-center">Loading...</div>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
