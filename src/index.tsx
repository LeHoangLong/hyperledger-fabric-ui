import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter, BrowserRouter, Routes, Route } from 'react-router-dom';
import { ipcRenderer } from 'electron'

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);

ipcRenderer.on('route', (event, arg) => {
  console.log('arg') // prints "ping"
  console.log(arg) // prints "ping"
})
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
