import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a27',
            color: '#f0f0fa',
            border: '1px solid rgba(255,255,255,0.07)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            borderRadius: '10px',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#1a1a27' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#1a1a27' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
