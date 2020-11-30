import { StateManager } from "@giveback007/util-lib/dist/browser";
import { HegData, HegState } from './heg-connection.type';
import { HegEventHandler } from './heg-event-handler';
import { nth, numPadSpace } from './util/util';
import { html, render,  } from 'lit-html';

const encoder = new TextEncoder();

const serviceUUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const rxUUID      = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
const txUUID      = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

function btStatsModal(s: HegState, stateUpdater: StateManager<HegState>['setState']) {
    const unf = s.ufSPS ? numPadSpace(s.ufSPS, 2) : '--';
    const sps = s.SPS ? `${(s.SPS + '').padStart(2, ' ')} => ${nth(s.SPS/s.ufSPS * 100, 0)}%` : '--';
    
    return html`<div id="bt-stats" class=${s.showBtStats ? "" : "hide"}>
        <div>Connected: <span id='device-connected'>${s.isConnected}</span></div>
        <div>SPS: <span id='device-sps'>${unf}|${sps}</span></div>
        <div>SPS Err: <span id='device-sps-errors'>${s.spsErrors} | ${nth(s.spsErrors/s.ufSPS * 100, 0)}%</span></div>
        <button id="bt-stats-off" @click=${() => stateUpdater({ showBtStats: false })}>X</button>
    </div>`;
}

export class HegConnection extends StateManager<HegState> {

    private device: BluetoothDevice | null = null;
    private server: BluetoothRemoteGATTServer | null = null;
    private cmdChar: BluetoothRemoteGATTCharacteristic | null = null;
    private characteristic: BluetoothRemoteGATTCharacteristic | null = null;
    private hegValueChangeHandler: HegEventHandler | null = null;
    
    constructor() {
        super({
            data: [ ],
            isReading: false,
            isConnected: false,
            lastVal: { } as HegData,
            showBtStats: true,
            SPS: 0,
            ufSPS: 0,
            timeConnected: 0,
            spsErrors: 0,
        },
        // { id: 'HegConnection', useKeys: ['showBtStats'] }
        );


        const btStatsRoot = document.createElement('div');
        document.body.appendChild(btStatsRoot);

        this.subToKeys(
            ['isConnected', 'showBtStats', 'SPS', 'ufSPS', 'spsErrors'],
            (s) => render(btStatsModal(s, this.setState), btStatsRoot)
        );
    }

    /** WARNING: DO NOT USE! */
    setState: StateManager<HegState>['setState'] = this.setState;

    async connect() {
        this.device = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'HEG' }],
            optionalServices: [serviceUUID]
        });
        
        const btServer = await this.device.gatt?.connect();
        if (!btServer) throw 'no connection';
        this.server = btServer;
    
        const service = await this.server.getPrimaryService(serviceUUID);
    
        // Send command to start HEG automatically (if not already started)
        this.cmdChar = await service.getCharacteristic(rxUUID);
        
        this.characteristic = await service.getCharacteristic(txUUID);

        this.hegValueChangeHandler = new HegEventHandler(
            this.characteristic, this.setState
        )

        this.setState({ isConnected: true, timeConnected: Date.now() });        
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
        this.setState({ isReading: true });
        
        this.hegValueChangeHandler.start();
    }

    async stopReadingHEG() {
        this.hegValueChangeHandler?.end();
        await this.sendCommand('f');
        this.setState({ isReading: false });
    }

    /** send a command by string:
     * (in) --DEVICE INSTRUCTIONS--
     * https://github.com/moothyknight/HEG_ESP32/blob/master/Device_README.txt
     */
    async sendCommand(msg: string) {
        if (!this.cmdChar) {
            console.log("HEG not connected");
            throw "error";
        }

        await this.cmdChar.writeValue(encoder.encode(msg));
    }
}
