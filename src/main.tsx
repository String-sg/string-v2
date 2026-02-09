import React from 'react';
import ReactDOM from 'react-dom/client';
import { SessionProvider } from 'next-auth/react';
import { Router } from './components/Router';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SessionProvider>
      <Router>
        <App />
      </Router>
    </SessionProvider>
  </React.StrictMode>
);
