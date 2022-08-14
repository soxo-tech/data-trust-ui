import React from 'react';
import ReactDOM from 'react-dom';

import 'antd/dist/antd.css';

import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

// These must be the first lines in src/index.js
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

