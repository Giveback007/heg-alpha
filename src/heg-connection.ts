import { interval, min, sec } from '@giveback007/util-lib';
import { StateManager } from "@giveback007/util-lib/dist/browser/state-manager";
import { now, sma, timeSma } from './util/util';

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

export type HegData = {
    sma10: number;
    sma30: number;
    sma1s: number;
    sma5s: number;
    sma10s: number;
    sma30s: number;
    sma1m: number;
    sma5m: number;
    time: number;
    red: number;
    ir: number;
    ratio: number;
}

type State = {
    showBtStats: boolean;
    isConnected: boolean;
    timeConnected: number;
    data: HegData[];
    lastVal: HegData;
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
            showBtStats: true,
            isConnected: false,
            timeConnected: 0,
            data: [],
            lastVal: {} as HegData
        });

        elm("bt-stats-off").onclick = () => this.setState({ showBtStats: false });

        this.subscribe(({ showBtStats }) => {
            elm("bt-stats").className = showBtStats ? "" : "hide";
        })
    }

    private filtSPSn = 0;
    private unfiltSPSn = 0;
    private intv = interval(() => {
        const n = this.filtSPSn;
        const u = this.unfiltSPSn;
        const d = this.device;
        
        if (this.getState().showBtStats) {
            elm('device-sps').innerHTML = n ? `${n} | ${(n/u * 100).toFixed(0)}%`  : '--';
            elm('device-ufsps').innerHTML = u ? u + '' : '--';
            elm("device").innerHTML = (d ? d.name : '--') + '';
            elm("device-id").innerHTML = (d ? d.id : '--') + '';
            elm("device-connected").innerHTML = (d ? d.gatt?.connected : '--') + '';
        }
   
        this.filtSPSn = 0;
        this.unfiltSPSn = 0;
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
        this.setState({ isConnected: true, timeConnected: now() });        
        return true;
    }

    async disconnect() {
        await this.stopReadingHEG();
        this.server?.disconnect();
        this.setState({ isConnected: false });
    }

    async startReadingHEG() {
        if (!this.characteristic) {
            console.log("HEG not connected");
            throw "error";
        }

        await this.sendCommand('o'); // 20bit
        await this.sendCommand('t');
        this.doReadHeg = true;
        
        const rawRatio: number[] = [];

        const data: HegData[] = [];
        const ratio: number[] = [];

        this.characteristic.startNotifications();
        this.characteristic.addEventListener('characteristicvaluechanged', (ev) => {
            if (!this.doReadHeg) return;
            this.unfiltSPSn++;
            const dataView = (ev.target as BluetoothRemoteGATTCharacteristic)?.value;
            const rawVal = decoder.decode(dataView);

            if (!rawVal) return;

            const arr = rawVal.split('|').map(x => Number(x));

            // filter NaN && (n < 0) values
            if (!arr[2] || arr[2] < 0) return;

            rawRatio[rawRatio.length] = arr[2];
            
            // Filter values that are 40% out of raw average
            const rawSMA60 = sma(rawRatio, 60);
            if (arr[2] < rawSMA60 * 0.6 || arr[2] > rawSMA60 * 1.4) return;

            const val: HegData = {
                sma10: 0,
                sma30: 0,
                sma1s: 0,
                sma5s: 0,
                sma10s: 0,
                sma30s: 0,
                sma1m: 0,
                sma5m: 0,
                time: now(),
                red: arr[0],
                ir: arr[1],
                ratio: arr[2],
            }

            data[data.length] = val;
            ratio[ratio.length] = val.ratio;

            val.sma10 = sma(ratio, 10);
            val.sma30 = sma(ratio, 30);

            val.sma1s = timeSma(data, sec(1));
            val.sma5s = timeSma(data, sec(5));
            val.sma10s = timeSma(data, sec(10));
            val.sma30s = timeSma(data, sec(30));
            val.sma1m = timeSma(data, min(1));
            val.sma5m = timeSma(data, min(5));

            this.setState({ data: [...data], lastVal: val });
            this.filtSPSn++;
        });
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
