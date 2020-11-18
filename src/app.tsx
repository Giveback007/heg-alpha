import * as React from 'react';
import { AppletsMenu } from './components/applets/applets';
import { Chart } from './components/chart';
import { MenuApp } from './components/menu/menu';
import { Ratio } from './components/ratio';

export class App extends React.Component {
    render() {
        return <>
            <MenuApp />
            <Ratio />
            <AppletsMenu />
            <Chart/>
        </>
    }
}
