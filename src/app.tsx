import * as React from 'react';
import * as ReactDOM from 'react-dom';

export class App extends React.Component {
    render() {
        return <div id="app">
            <Menu />
        </div>
    }
}

class Menu extends React.Component {
    render() {
        return <div id="menu">

        </div>
    }
}


// On mouse move show menu button