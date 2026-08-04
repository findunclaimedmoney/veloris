import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// ================================================
// 🛡️ PERMANENT CRASH SHIELD FOR content.js 🛡️
// ================================================
// This catches the "Cannot read properties of undefined (reading 'toLowerCase')"
// error coming from the Hercules SDK bundle (content.js) and blocks it 
// from freezing the browser.
window.addEventListener('error', function(e) {
  if (e.message && 
      e.message.includes('content.js') && 
      e.message.includes('toLowerCase')) {
    console.warn("🚫 Blocked the content.js crash!");
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
}, true);
// ================================================

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);