import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import './index.css'
import App from './App.tsx'
import { registerSW } from 'virtual:pwa-register';

// registerSW({ immediate: true })
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('New version available, click OK to refresh')) {
      updateSW()
    }
  },
  onOfflineReady() {
    console.log('App is ready to work offline')
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>,
)
