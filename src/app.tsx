import * as React from 'react';
import { AppletsMenu } from './components/applets/applets';
import { Chart } from './components/chart';
import { MenuApp } from './components/menu';

export class App extends React.Component {
    render() {
        return <>
            <MenuApp />
            <AppletsMenu />
            <Chart/>
        </>
    }
}
