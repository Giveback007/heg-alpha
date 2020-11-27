import * as React from 'react';
import YouTube from 'react-youtube';
import { AppletsMenu } from './components/applets/applets';
import { Chart } from './components/chart';
import { MenuApp } from './components/menu/menu';
import { Ratio } from './components/ratio';


export class App extends React.Component {
    render() {
        return <>
            <MenuApp />
            {/* <YouTube videoId="2g811Eo7K8U" onReady={this._onReady} /> */}
            <Ratio />
            <AppletsMenu />
            <Chart/>
        </>
    }

    // _onReady(event) {
    //     // access to player in all event handlers via event.target
    //     event.target.pauseVideo();
    // }
}
