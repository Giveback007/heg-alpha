import * as React from 'react';
import { Chart } from './components/chart';
import { MenuApp } from './components/menu';

export class App extends React.Component {
    render() {
        return <>
            <MenuApp />
            <Chart />
        </>
    }
}


// On mouse move show menu button