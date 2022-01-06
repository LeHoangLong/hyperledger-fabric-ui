import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ipcRenderer } from 'electron'
import { Channels } from '../common/channels';
import { CertificateAuthorityPage } from './pages/CertificateAuthorityPage';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/admin" element={<h1>Hello 1</h1>}>
        </Route>
        <Route path='/ca' element={ <CertificateAuthorityPage/> }></Route>
        <Route path="/*" element={<h1>Hello 2</h1>}>
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

ipcRenderer.on(Channels.ROUTE, (event, arg) => {
  window.location.hash = arg
})
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
