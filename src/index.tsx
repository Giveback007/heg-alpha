import React = require('react');
import ReactDOM = require('react-dom');

import CssBaseline from '@material-ui/core/CssBaseline';
import { App }  from './app';
import { elm, now } from './util/util';
import { HegData } from './heg-connection';
import { average, wait } from '@giveback007/util-lib';
import { chartT } from './components/chart';
import { heg } from './store';

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

heg.subscribe(({ lastVal }) => {
    // console.log(lastVal.ratio);
    
    elm('ratio').innerHTML = 'ratio: ' + lastVal.sma30.toFixed(2);
})

const simData: HegData[] = require('../sim-data.json');
async function test2() {
    console.log('Start');
    const startTime = now();
    
    let i = 0;
    const data: HegData[] = [];
    while (i < simData.length) {
        const x = simData[i];
        while(now() < startTime + x.time) await wait(1);

        // -- Sim code -- //
        data[i] = x;
        const sArr = data.slice(-40).map(x => x.ratio);
        const sma = average(sArr);

        chartT.append(now(), sma);
        console.log(sma);
        
        // -- Sim code -- //

        i++;
    }
}

// test2();


// -- Util -- //
// function bleNotification([
//     mcrs, red, infr, ratio, ambient, _1stDer, _2ndDer
// ]: string[]) {
//     elm("output").innerHTML = `
//         <div>mrcs: ${mcrs}</div>
//         <div>red: ${red}</div>
//         <div>infr: ${infr}</div>
//         <div>ratio: ${ratio}</div>
//         <div>ambnt: ${ambient}</div>
//         <div>1st d: ${_1stDer}</div>
//         <div>2nd d: ${_2ndDer}</div>
//     `;
// }

// -- Bluetooth -- //
// async function connect() {
//     await heg.connect();
//     heg.startReadingHEG();

//     heg.subscribe(({ lastVal }) => {
//         const arr = lastVal.replace(/[\n\r]+/g, '').split('|');
//         bleNotification(arr);
//     });
// }

// elm("bt").onclick = () => connect();
// elm("bt-dc").onclick = () => heg.disconnect();
// elm("bt-stats-toggle").onclick = () => heg.setState({ showBtStats: !heg.getState().showBtStats });
// elm("bt-send-command").onclick = () => heg.sendCommand((elm("bt-command") as any).value);

// function test() {
//     let sub: any;
//     let timeStart: number;

//     sub = heg.subscribe(({ isConnected }) => {
//         if (!isConnected) return;
//         timeStart = now();
//         sub.unsubscribe();
//     });

//     heg.subscribe(({ data }) => {
//         if (data.length === 1000) console.log('READY!');
//         window.data = { timeStart, data };
//     });
// }

// test();
