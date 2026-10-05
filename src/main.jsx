import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { I18nProvider } from './context/I18nContext';
import { StudentProvider } from './context/StudentContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <StudentProvider>
          <App />
        </StudentProvider>
      </I18nProvider>
    </ThemeProvider>
  </React.StrictMode>
);
