import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/jetbrains-mono';
import App from './App'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '@/store';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { setupMonacoEnvironment } from './lib/setupMonacoEnvironment';
setupMonacoEnvironment();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store} >
      <PersistGate loading={<div className="text-white text-center">Loading...</div>} persistor={persistor}>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
