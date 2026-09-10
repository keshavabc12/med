import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// AuthProvider removed
import { AdminAuthProvider } from './context/AdminAuthContext';
// CartProvider removed
import { CatalogProvider } from './context/CatalogContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
        <AdminAuthProvider>
          <CatalogProvider>
              <App />
          </CatalogProvider>
        </AdminAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
