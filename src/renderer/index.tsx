import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ipcRenderer } from 'electron'
import { Channels } from '../common/channels';
import { CertificateAuthorityPage } from './pages/CertificateAuthorityPage';
import { Provider } from 'react-redux'
import store from './reducers/RootReducer'
import { ClientConfigurationPage } from './pages/ClientConfigurationPage';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <HashRouter>
        <Routes>
          <Route path="/admin" element={<h1>Hello 1</h1>}>
          </Route>

          <Route path="/cc" element={ <ClientConfigurationPage></ClientConfigurationPage> }>
          </Route>
          
          <Route path='/ca' element={ <CertificateAuthorityPage/> }></Route>
          <Route path="/*" element={<h1>Hello 2</h1>}>
          </Route>
        </Routes>
      </HashRouter>
    </Provider>
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
