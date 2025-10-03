import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App';
import '../styles/globals.css';

// Import Capacitor
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Define custom elements (for native camera, etc.)
defineCustomElements(window);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);