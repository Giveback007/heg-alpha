import { arrLast } from '@giveback007/util-lib';
import { HegTuple } from "./heg-connection.type";

const decoder = new TextDecoder("utf-8");

const xThis = {
    raw: [] as string[],
    ratio: [] as number[]
}

function handleEventData(ev: Event, delimiter = "|", uIdx = 0, rIdx = 3) {
    const dataView = (ev.target as BluetoothRemoteGATTCharacteristic)?.value;
    const rawVal = decoder.decode(dataView);
    xThis.raw.push(rawVal);

    const arr = rawVal.split('|').map(x => parseFloat(x)) as HegTuple;
    var rt = arr[2];

    // filter (NaN, 0 & n < 0) values
    if (!rt || rt < 0) return;

    xThis.ratio.push(rt);
    if (xThis.ratio.length <= 5) return;

    const rtArr = xThis.ratio.slice(xThis.ratio.length - 5, xThis.ratio.length);
    var temp = sma(rtArr, 5);
    
    if (
        (arrLast(xThis.ratio) < temp[4] * 0.7)
        ||
        (arrLast(xThis.ratio) > temp[4] * 1.3)
    ) {
        xThis.ratio[xThis.ratio.length - 1] = xThis.ratio[xThis.ratio.length - 2]; // Roll the ratio back if outside margin 
        arr[2] = temp;
    } 
    this.filtered.push(arr.join(delimiter));

    //handle new data
    // this.handleScore();
    // if (this.defaultUI === true) this.updateStreamRow(arr);
}

function sma(arr: number[], n: number) {
    const temp = [];
    
    for (let i = 0; i < arr.length; i++) {
      if (i === 0) {
        temp.push(arr[0]);
      } else if (i < n) { // average partial window (prevents delays on screen)
        const arrSlice = arr.slice(0, i + 1);
        temp.push(arrSlice.reduce((previous, current) => current += previous) / (i + 1));
      } else { // average windows
        const arrSlice = arr.slice(i - n, i);
        temp.push(arrSlice.reduce((previous, current) => current += previous) / n);
      }
    }

    return temp;
}