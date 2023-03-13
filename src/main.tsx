import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './samples/window-title';
import './samples/discord-presence';
import './samples/updater';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
