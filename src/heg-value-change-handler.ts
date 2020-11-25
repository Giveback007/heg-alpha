import { average, sec } from '@giveback007/util-lib';
import { StateManager } from '@giveback007/util-lib/dist/browser';
import { HegData, HegState, HegTuple } from './heg-connection.type';
import { genHegData, ratioFromTime, sma, timeSma } from './heg-connection.util';
import { now } from './util/util';

const decoder = new TextDecoder("utf-8");

export class HegValueChangeHandler {

    private rawRatio: number[] = [];
    private ratio: number[] = [];
    private data: HegData[] = [];
    
    private secI = 0;
    private secT = Math.floor(now() / 1000) * 1000 + 2000;
    private secRatio: number[] = [];

    private ufSPS: number = 0;
    private SPS: number = 0;

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

    private handleValue = (ev: Event) => {
        const t = now();

        if (t >= this.secT) {
            this.secRatio[this.secI] = ratioFromTime(this.data, this.secT - 1000);
            this.secT = Math.floor(t / 1000) * 1000 + 1000;
            this.secI++;

            this.stateUpdater({ SPS: this.SPS, ufSPS: this.ufSPS });
            this.SPS = 0;
            this.ufSPS = 0;
        }

        this.ufSPS++; // FIX
        const dataView = (ev.target as BluetoothRemoteGATTCharacteristic)?.value;
        const rawVal = decoder.decode(dataView);

        if (!rawVal) return;

        const arr = rawVal.split('|').map(x => Number(x)) as HegTuple;

        // filter (NaN, 0 & n < 0) values
        if (!arr[2] || arr[2] < 0) return;

        this.rawRatio[this.rawRatio.length] = arr[2];
        
        // Filter values that are 30% out of raw average
        const rawSMA60 = sma(this.rawRatio, 60);
        if (arr[2] < rawSMA60 * 0.30 || arr[2] > rawSMA60 * 1.30)
            return; // console.log((rawSMA60 / arr[2] * 100).toFixed(0) + '%');

        const val = genHegData(arr, t);

        this.data[this.data.length] = val;
        this.ratio[this.ratio.length] = val.ratio;

        val.sma2s = timeSma(this.data, sec(2));

        this.secRatio[this.secI] = timeSma(this.data, sec(1));
        val.avg5s = average(this.secRatio.slice(-6));
        val.avg10s = average(this.secRatio.slice(-11));
        val.avg1m = average(this.secRatio.slice(-61));
        val.avg5m = average(this.secRatio.slice(-60 * 5));

        this.stateUpdater({ data: [...this.data], lastVal: val });
        this.SPS++;
    }
}
