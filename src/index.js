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
const encoder     = new TextEncoder("utf-8");
const decoder     = new TextDecoder("utf-8");

// -- Util -- //
const elm = (id) => document.getElementById(id);

const sleeper = (ms) => (x) => 
    new Promise(resolve => setTimeout(() => resolve(x), ms));

function bleNotification(e) {
    const val = decoder.decode(e.target.value);
    elm("output").innerHTML = val;
}

function updateDeviceStatus(device) {
    setInterval(() => {
        elm("device").innerHTML = device.name;
        elm("device-id").innerHTML = device.id;
        elm("device-connected").innerHTML = device.gatt.connected;
    }, 1000);
}

// -- Bluetooth -- //
elm("bt").onclick = () => {

    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [serviceUUID] //
    })
    .then(device => {
        updateDeviceStatus(device);
        return device.gatt.connect(); //Connect to HEG
    })
    .then(sleeper(100)).then(server => server.getPrimaryService(serviceUUID))
    .then(sleeper(100)).then(service => { 
        // Send command to start HEG automatically (if not already started)
        service.getCharacteristic(rxUUID).then(tx => tx.writeValue(encoder.encode("t")));
        return service.getCharacteristic(txUUID) // Get stream source
    })
    // Subscribe to stream
    .then(sleeper(100)).then(characteristic=> characteristic.startNotifications())
    .then(sleeper(100)).then(characteristic =>
        //Update page with each notification
        characteristic.addEventListener('characteristicvaluechanged', bleNotification)
    )
    .catch(err => console.error(err));
}
