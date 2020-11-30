import { min, sec } from '@giveback007/util-lib';
import { StateManager } from '@giveback007/util-lib/dist/browser';
import { HegData, HegState, HegTuple } from './heg-connection.type';
import { genHegData, sma, timeSma } from './heg-connection.util';

const decoder = new TextDecoder("utf-8");

export class HegEventHandler {

    private rawRatio: number[] = [];
    private ratio: number[] = [];
    private data: HegData[] = [];
    
    private secT = Math.floor(Date.now() / 1000) * 1000 + 1000;

    private prevMidSPS: number = 0; // previous midSPS
    private midSPS: number = 0; // SPS after error filter
    private spsErrors: number = 0; // number of SPS errors per second
    private ufSPS: number = 0; // unfiltered SPS
    private SPS: number = 0; // Samples Per Second

    constructor(
        private characteristic: BluetoothRemoteGATTCharacteristic,
        private stateUpdater: StateManager<HegState>['setState']
    ) { }

    async start() {
        this.characteristic.startNotifications();
        this.characteristic.addEventListener('characteristicvaluechanged', this.handleValue);
    }

    async end () {
        this.characteristic.stopNotifications();
        this.characteristic.removeEventListener('characteristicvaluechanged', this.handleValue);

        this.stateUpdater({ SPS: 0, ufSPS: 0 });
    }

    private handleSPS({ SPS, ufSPS, spsErrors, midSPS } = this) {
        this.stateUpdater({ SPS, ufSPS, spsErrors });

        this.prevMidSPS = midSPS;
        this.spsErrors = 0;
        this.midSPS = 0;
        this.SPS = 0;
        this.ufSPS = 0;
    }

    private handleValue = (ev: Event) => {
        const t = Date.now();

        if (t >= this.secT) {
            this.secT = Math.floor(t / 1000) * 1000 + 1000;
            this.handleSPS();
        }

        this.ufSPS++;
        const dataView = (ev.target as BluetoothRemoteGATTCharacteristic)?.value;
        const rawVal = decoder.decode(dataView);

        if (!rawVal) return;

        const arr = rawVal.split('|').map(x => parseFloat(x)) as HegTuple;
        const rt = arr[2]; // ratio

        // filter (NaN, 0 & n < 0) values
        if (!rt || rt < 0) return this.spsErrors++;
        this.midSPS++;

        // Filter values 30% out of raw-average/per-half-second
        this.rawRatio[this.rawRatio.length] = rt;
        const smaN = Math.ceil(this.prevMidSPS / 2); // half second rawSMA
        const rawSMA = sma(this.rawRatio, smaN > 5 ? smaN : 5);
        
        if (rt < rawSMA * 0.70 || rt > rawSMA * 1.30)
            return; // console.log((rawSMA5 / arr[2] * 100).toFixed(0) + '%');

        const val = genHegData(arr, t, this.ratio);
        this.data[this.data.length] = val;
        this.ratio[this.ratio.length] = val.ratio;

        val.sma2s = timeSma(this.data, sec(2));
        val.sma10s = timeSma(this.data, sec(10));
        val.sma1m = timeSma(this.data, min(1));
        val.sma5m = timeSma(this.data, min(5));
        val.sma10m = timeSma(this.data, min(10));

        this.stateUpdater({ data: [...this.data], lastVal: val });
        this.SPS++;
    }
}
