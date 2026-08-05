import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// 🛡️ CRASH SHIELD
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
