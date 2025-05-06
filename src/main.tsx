import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Optional: add your global styles here

// This is where the root element is defined for the React app
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// Render the App component into the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
