import { interval } from '@giveback007/util-lib';
import { hegConnection } from './heg-connection';
import { main } from './main'
import * as serviceWorker from './service-worker';
import { elm } from './util/util';

main(); // import test

if (process.env.NODE_ENV === 'development') {
    console.log('DEV MODE')
}

if (process.env.NODE_ENV === 'production') {
    // import * as serviceWorker from './service-worker';
    //const serviceWorker = require('./service-worker');
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    serviceWorker.register();
}

// -- Util -- //
function bleNotification([
    mcrs, red, infr, ratio, ambient, _1stDer, _2ndDer
]: string[]) {
    elm("output").innerHTML = `
        <div>mrcs: ${mcrs}</div>
        <div>red: ${red}</div>
        <div>infr: ${infr}</div>
        <div>ratio: ${ratio}</div>
        <div>ambnt: ${ambient}</div>
        <div>1st d: ${_1stDer}</div>
        <div>2nd d: ${_2ndDer}</div>
    `;
}

// -- Bluetooth -- //
const heg = new hegConnection();

async function connect() {
    await heg.connect();
    heg.startReadingHEG();

    heg.subscribe(({ lastVal }) => {
        const arr = lastVal.replace(/[\n\r]+/g, '').split('|');
        bleNotification(arr);
    });
}

elm("bt").onclick = () => connect();
elm("bt-dc").onclick = () => heg.disconnect();
elm("bt-stats-toggle").onclick = () => heg.setState({ showBtStats: !heg.getState().showBtStats });

heg.subscribe(({ showBtStats }) => {
    elm("bt-stats").className = showBtStats ? "" : "hide";
})

