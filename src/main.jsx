import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { Provider } from 'react-redux'
import { store } from './redux/store.js'

import './utils/i18n.js'
import './index.css'
import App from './App.jsx'
import { FacebookProvider } from 'react-facebook'

const loadingMarkup = (
  <div className="py-4 text-center">
    <h3>Loading..</h3>
  </div>
)

createRoot(document.getElementById('root')).render(
  
  <Provider store={store}>
    <FacebookProvider appId='550066020937862'>
    <GoogleOAuthProvider clientId='348252864229-knvikkfilg4hu7tc2k6en3ltncca6v4j.apps.googleusercontent.com'>
      <Suspense fallback={loadingMarkup}>
        <App />
      </Suspense>
    </GoogleOAuthProvider>
  </FacebookProvider>
  </Provider>
)
