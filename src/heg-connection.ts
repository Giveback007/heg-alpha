import { StateManager } from "@giveback007/util-lib/dist/browser/state-manager";
import { interval } from "@giveback007/util-lib";
import { elm } from './util/util';

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

export class hegConnection extends StateManager<{ data: string[] }> {
    private serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    private rxUUID      = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
    private txUUID      = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

    private device: BluetoothDevice | null = null;
    private server: BluetoothRemoteGATTServer | null = null;
    private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

    private doReadHeg = false;

    constructor() { super({ data: [] }); }

    async connect() {
        this.device = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'HEG' }],
            optionalServices: [this.serviceUUID]
        });
    
        this.updateDeviceStatus(this.device);
        
        const btServer = await this.device.gatt?.connect();
        if (!btServer) throw 'no connection';
        this.server = btServer;
    
        const service = await this.server.getPrimaryService(this.serviceUUID);
    
        // Send command to start HEG automatically (if not already started)
        const tx = await service.getCharacteristic(this.rxUUID);
        await tx.writeValue(encoder.encode("t"));
        
        this.characteristic = await service.getCharacteristic(this.txUUID);
        return true;
    }

    disconnect = () => this.server?.disconnect();

    async startHeg() {
        if (!this.characteristic) {
            console.log("HEG not connected");
            throw "error";
        }

        // await this.characteristic.startNotifications();
        this.doReadHeg = true;
        
        const data: string[] = [];
        while (this.doReadHeg) {
            const val = decoder.decode(await this.characteristic.readValue());
            if (val !== data[data.length]) {
                data[data.length] = val;
                this.setState({ data: [...data] });
            }
        }
    }

    stopHeg = () => {
        this.doReadHeg = false;
    }

    private updateDeviceStatus(device: BluetoothDevice) {
        interval(() => {
            elm("device").innerHTML = device.name + '';
            elm("device-id").innerHTML = device.id;
            elm("device-connected").innerHTML = device.gatt?.connected + '';
        }, 1000, 10);
    }
}
