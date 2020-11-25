import { average } from '@giveback007/util-lib';
import { HegData, HegTuple } from './heg-connection.type';

export const sma = (arr: number[], n: number) => average(arr.slice(-1 * n))

export function timeSma(data: HegData[], ms: number) {
    const len = data.length;
    if (!len) return 0;

    const fromTime = data[len - 1].time - ms;
    return ratioFromTime(data, fromTime);
}

export function ratioFromTime(data: HegData[], fromTime: number) {
    const x: HegData[] = [];

    let i = data.length - 1;
    while (i > 0 && data[i].time >= fromTime) {
        x.push(data[i]);
        i--;
    }

    return average(x.map(y => y.ratio)) || 0;
}

export const genHegData = (newVal: HegTuple, time: number): HegData => ({
    sma2s: 0,
    avg5s: 0,
    avg10s: 0,
    avg1m: 0,
    avg5m: 0,
    time,
    red: newVal[0],
    ir: newVal[1],
    ratio: newVal[2],
});
