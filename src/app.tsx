import * as React from 'react';
import { Menu } from './components/menu';

export class App extends React.Component {
    render() {
        return <div id="app">
            <Menu />
        </div>
    }
}


// On mouse move show menu button