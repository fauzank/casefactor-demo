import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ToastContainer } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';
import { HashRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports'

Amplify.configure(aws_exports);

ReactDOM.render(
  <React.Fragment>
    <HashRouter>
      <App />
      <ToastContainer style={{ width: "max-content", textAlign: "center" }} />
    </HashRouter>
  </React.Fragment>,
  document.getElementById('root')
);

// console.log = function () {};
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
serviceWorker.unregister();