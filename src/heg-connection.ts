import { interval } from '@giveback007/util-lib';
import { StateManager } from "@giveback007/util-lib/dist/browser/state-manager";

const elm = (id: string) => {
    const el = document.getElementById(id);
    if (!el) {
        console.log('no element with id: ' + id)
        throw 'error'
    }
    
    return el;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8");

type State = {
    showBtStats: boolean;
    data: string[];
    lastVal: string;
}

export class hegConnection extends StateManager<State> {
    private readonly serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    private readonly rxUUID      = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
    private readonly txUUID      = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

    private device: BluetoothDevice | null = null;
    private server: BluetoothRemoteGATTServer | null = null;
    private cmdChar: BluetoothRemoteGATTCharacteristic | null = null;
    private characteristic: BluetoothRemoteGATTCharacteristic | null = null;

    private doReadHeg = false;
    constructor() {
        super({
            showBtStats: false,
            data: [],
            lastVal: '',
        });

        elm("bt-stats-off").onclick = () => this.setState({ showBtStats: false });
    }

    private n = 0;
    private intv = interval(() => {
        const n = this.n;
        const d = this.device;
        
        if (this.getState().showBtStats) {
            elm('device-sps').innerHTML = n ? n + '' : '--';
            elm("device").innerHTML = (d ? d.name : '--') + '';
            elm("device-id").innerHTML = (d ? d.id : '--') + '';;
            elm("device-connected").innerHTML = (d ? d.gatt?.connected : '--') + '';
        }
        
        this.n = 0;
    }, 1000);

    async connect() {
        this.device = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'HEG' }],
            optionalServices: [this.serviceUUID]
        });
        
        const btServer = await this.device.gatt?.connect();
        if (!btServer) throw 'no connection';
        this.server = btServer;
    
        const service = await this.server.getPrimaryService(this.serviceUUID);
    
        // Send command to start HEG automatically (if not already started)
        this.cmdChar = await service.getCharacteristic(this.rxUUID);
        
        this.characteristic = await service.getCharacteristic(this.txUUID);
        return true;
    }

    async disconnect() {
        await this.stopReadingHEG();
        this.server?.disconnect();
    }

    async startReadingHEG() {
        if (!this.characteristic) {
            console.log("HEG not connected");
            throw "error";
        }

        await this.sendCommand('t');
        this.doReadHeg = true;
        
        const data: string[] = [];
        while (this.doReadHeg) {
            const val = decoder.decode(await this.characteristic.readValue());
            if (val !== data[data.length]) {
                data[data.length] = val;
                this.setState({ data: [...data], lastVal: val });
                this.n++;
            }
        }
    }

    async stopReadingHEG() {
        this.doReadHeg = false;
        await this.sendCommand('f');
    }

    /** send a command by string:
     * (in) --DEVICE INSTRUCTIONS--
     * https://github.com/moothyknight/HEG_ESP32/blob/master/Device_README.txt
     */
    async sendCommand(str: string) {
        if (!this.cmdChar) {
            console.log("HEG not connected");
            throw "error";
        }

        await this.cmdChar.writeValue(encoder.encode(str));
    }
}