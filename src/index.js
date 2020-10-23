import { main } from './main'

main();


if (process.env.NODE_ENV !== 'development') {
    console.log('dev')
}

if (process.env.NODE_ENV === 'production') {
    // import * as serviceWorker from './service-worker';
    const serviceWorker = require('./service-worker');
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    serviceWorker.register();
}

const elm = (id) => document.getElementById(id);

function updateDeviceStatus(device) {
    setInterval(() => {
        elm("device").innerHTML = device.name;
        elm("device-id").innerHTML = device.id;
        elm("device-connected").innerHTML = device.gatt.connected;
    }, 1000)
    
}

document.getElementById("bt").onclick = () => {

    const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    const rxUUID='6e400002-b5a3-f393-e0a9-e50e24dcca9e';
    const txUUID='6e400003-b5a3-f393-e0a9-e50e24dcca9e';
    const encoder = new TextEncoder("utf-8");
    const decoder = new TextDecoder("utf-8");

    const promise = navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [serviceUUID] //
    }).then(device => {
        updateDeviceStatus(device);  
        return device.gatt.connect();
    })
    .then(server => server.getPrimaryService(serviceUUID))
    .then(service => { 
        service.getCharacteristic(rxUUID).then(tx => {
            return tx.writeValue(encoder.encode("t"));
        });
        return service.getCharacteristic(txUUID)
    }).catch(err => console.error(err))

    setTimeout(() => promise
        .then(() => characteristic.startNotifications())
        .then(() => characteristic.addEventListener('characteristicvaluechanged', blenotification))
    , 1000);
    
    function blenotification(e){
        const val = decoder.decode(e.target.value);
        document.getElementById("output").innerHTML = val;
    }
}
