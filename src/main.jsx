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
    <FacebookProvider appId={import.meta.env.VITE_FACEBOOK_CLIENT_ID}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Suspense fallback={loadingMarkup}>
          <App />
        </Suspense>
      </GoogleOAuthProvider>
    </FacebookProvider>
  </Provider>
)
