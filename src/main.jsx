import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { UserProvider } from './context/UserContext.jsx';
import { EmissionsProvider } from './context/EmissionsContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <EmissionsProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </EmissionsProvider>
    </UserProvider>
  </React.StrictMode>,
);
