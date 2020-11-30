import React = require('react');
import ReactDOM = require('react-dom');

import CssBaseline from '@material-ui/core/CssBaseline';
import { App }  from './app';

ReactDOM.render(
    <><CssBaseline/><App/></>,
    document.getElementById('root')
);

if (process.env.NODE_ENV === 'development') {
    console.log('DEV MODE')
}

if (process.env.NODE_ENV === 'production') {
    // import * as serviceWorker from './service-worker';
    const serviceWorker = require('./service-worker');
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    serviceWorker.register();
}
