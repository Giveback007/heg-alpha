import { rand } from '@giveback007/util-lib';
import { StateManager } from "@giveback007/util-lib/dist/browser/state-manager";
import { HegData, HegState } from './heg-connection.type';
import { HegValueChangeHandler } from './heg-value-change-handler';
import { now, elm, nth, numPadSpace } from './util/util';

const encoder = new TextEncoder();

export class hegConnection extends StateManager<HegState> {
    private readonly serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
    private readonly rxUUID      = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
    private readonly txUUID      = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

    private device: BluetoothDevice | null = null;
    private server: BluetoothRemoteGATTServer | null = null;
    private cmdChar: BluetoothRemoteGATTCharacteristic | null = null;
    private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
    private hegValueChangeHandler: HegValueChangeHandler | null = null;
    
    constructor() {
        super({
            data: [],
            isReading: false,
            isConnected: false,
            lastVal: {} as HegData,
            showBtStats: true,
            SPS: 0,
            ufSPS: 0,
            timeConnected: 0,
        });

        elm("bt-stats-off").onclick = () => this.setState({ showBtStats: false });

        this.subscribe(({ showBtStats, SPS, ufSPS, isConnected }, prv) => {
            if (prv.SPS !== SPS || prv.ufSPS !== ufSPS) {
                const unf = ufSPS ? numPadSpace(ufSPS, 2) : '--';
                const sps = SPS ? `${(SPS + '').padStart(2, ' ')} => ${nth(SPS/ufSPS * 100, 0)}%` : '--';

                elm('device-sps').innerHTML = `${unf}/${sps}`;
            }
            
            if (prv.isConnected !== isConnected)
                elm("device-connected").innerHTML = isConnected + '';

            if (prv.showBtStats !== showBtStats)
                elm("bt-stats").className = showBtStats ? "" : "hide";
        });
    }

    /** WARNING: DO NOT USE! */
    setState: StateManager<HegState>['setState'] = this.setState;

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

        this.hegValueChangeHandler = new HegValueChangeHandler(
            this.characteristic, this.setState
        )

        this.setState({ isConnected: true, timeConnected: now() });        
        return true;
    }

    async disconnect() {
        await this.stopReadingHEG();
        this.server?.disconnect();
        this.setState({ isConnected: false });
    }

    async startReadingHEG() {
        if (!this.characteristic) throw "HEG not connected";
        if (!this.hegValueChangeHandler) throw "this.hegValueChangeHandler not set";

        await this.sendCommand('o'); // 20bit
        await this.sendCommand('t');
        this.setState({ isReading: true })
        
        this.hegValueChangeHandler.start();
    }

    async stopReadingHEG() {
        this.hegValueChangeHandler?.end();
        await this.sendCommand('f');
        this.setState({ isReading: false })
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
