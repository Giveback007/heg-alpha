import { main } from './main'
import * as serviceWorker from './service-worker';

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

// -- Vars -- //
const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const rxUUID      = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const txUUID      = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const encoder     = new TextEncoder();
const decoder     = new TextDecoder("utf-8");

// -- Util -- //
const elm = (id: string) => {
    const el = document.getElementById(id);
    if (!el) {
        console.log('no element with id: ' + id)
        throw 'error'
    }
    return el;
};

// const sleeper = (ms: number) => <T>(x: T): Promise<T> => 
//     new Promise(resolve => setTimeout(() => resolve(x), ms));

function bleNotification([
    mcrs, red, infr, ratio, ambient, _1stDer, _2ndDer
]: string[]) {
    // const val = decoder.decode(e.target.value);
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

function updateDeviceStatus(device: BluetoothDevice) {
    setInterval(() => {
        elm("device").innerHTML = device.name + '';
        elm("device-id").innerHTML = device.id;
        elm("device-connected").innerHTML = device.gatt?.connected + '';
    }, 1000);
}

// -- Bluetooth -- //
async function connect() {
    const btDevice = await navigator.bluetooth.requestDevice({
        // acceptAllDevices: true,
        filters: [{ namePrefix: 'HEG' }],
        optionalServices: [serviceUUID]
    });

    updateDeviceStatus(btDevice);
    
    const btServer = await btDevice.gatt?.connect();
    if (!btServer) throw 'no connection';

    const service = await btServer.getPrimaryService(serviceUUID);

    // Send command to start HEG automatically (if not already started)
    const tx = await service.getCharacteristic(rxUUID)
    await tx.writeValue(encoder.encode("t"));
    
    const characteristic = await service.getCharacteristic(txUUID);

    let lastValue = decoder.decode(await characteristic.readValue());
    let n = 0;
    let time = new Date().getTime();

    async function readVal(): Promise<any> {
        const data = await characteristic.readValue();
        const val = decoder.decode(data);
        const arr = val.replace(/[\n\r]+/g, '').split('|');
        // console.log(arr);

        // only update on unique value
        if (lastValue === val) return readVal();
        n++;
        lastValue = val;
        const newTime = new Date().getTime();
        if (time < (newTime - 1000)) {
            elm('device-sps').innerHTML = n + '';
            time = newTime;
            n = 0;
        }

        bleNotification(arr);
        readVal();
    }

    readVal();
}

elm("bt").onclick = () => connect();
