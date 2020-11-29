import { arrLast, average, sec } from '@giveback007/util-lib';
import { StateManager } from '@giveback007/util-lib/dist/browser';
import { HegData, HegState, HegTuple } from './heg-connection.type';
import { genHegData, ratioFromTime, sma, timeSma } from './heg-connection.util';

const decoder = new TextDecoder("utf-8");

export class HegValueChangeHandler {

    private rawRatio: number[] = [];
    private ratio: number[] = [];
    private data: HegData[] = [];
    
    private secI = 0; // index fo
    private secT = Math.floor(Date.now() / 1000) * 1000 + 1000;
    private secRatio: number[] = [];

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
            this.secRatio[this.secI] = ratioFromTime(this.data, this.secT - 1000);
            this.secT = Math.floor(t / 1000) * 1000 + 1000;
            this.secI++; // ensures that this index only moves once per second

            this.handleSPS();
        }

        this.ufSPS++; // FIX
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
        
        if (rt < rawSMA * 0.7 || rt > rawSMA * 1.3) {
            // rt = arrLast(this.ratio);
            // console.log((rawSMA5 / arr[2] * 100).toFixed(0) + '%');
            return;
        }

        const val = genHegData(arr, t);

        this.data[this.data.length] = val;
        this.ratio[this.ratio.length] = val.ratio;

        val.sma2s = timeSma(this.data, sec(2));

        this.secRatio[this.secI] = timeSma(this.data, sec(1));
        val.avg10s = average(this.secRatio.slice(-10));
        val.avg1m = average(this.secRatio.slice(-60));
        val.avg5m = average(this.secRatio.slice(-300));
        val.avg10m = average(this.secRatio.slice(-600));

        this.stateUpdater({ data: [...this.data], lastVal: val });
        this.SPS++;
    }
}
