import { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { Provider } from 'react-redux';
import { store } from './redux/store.js';

import './utils/i18n.js';
import './index.css';
import './assets/animations.css';
import App from './App.jsx';
import { FacebookProvider } from 'react-facebook';

import { registerSW } from 'virtual:pwa-register';

// Import stagewise toolbar for React (only in development mode)
import { StagewiseToolbar } from '@stagewise/toolbar-react';

registerSW({
  // onNeedRefresh() {
  //   if (confirm('New update available. Reload now?')) {
  //     location.reload();
  //   }
  // },
  onOfflineReady() {
    console.log('PWA is ready to work offline.');
  },
});

const loadingMarkup = (
  <div className="py-4 text-center">
    <h3>Loading..</h3>
  </div>
);

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
);

// Initialize stagewise toolbar only in development mode
if (import.meta.env.MODE === 'development') {
  // Create a separate container for the stagewise toolbar
  const stagewiseContainer = document.createElement('div');
  stagewiseContainer.id = 'stagewise-toolbar-container';
  document.body.appendChild(stagewiseContainer);
  
  // Create a separate React root for the stagewise toolbar
  const stagewiseRoot = createRoot(stagewiseContainer);
  
  // Configure stagewise toolbar
  const stagewiseConfig = {
    plugins: []
  };
  
  // Render the stagewise toolbar
  stagewiseRoot.render(
    <StagewiseToolbar config={stagewiseConfig} />
  );
}
