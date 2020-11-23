import { AnyObj, average, objMap } from '@giveback007/util-lib';
import { viewSize } from '@giveback007/util-lib/dist/browser';
import { HegData } from '../heg-connection';

export const elm = (id: string) => {
    const el = document.getElementById(id);
    if (!el) {
        console.log('no element with id: ' + id)
        throw 'error'
    }
    
    return el;
};

export const onViewResize = (f: (o: { height: number, width: number }) => any) =>
    window.addEventListener('resize', () => f(viewSize()));

export const now = () => new Date().getTime();

export const unsubAll = (obj: AnyObj) =>
    objMap(obj, ({ key, val }) => key === 'unsubscribe' ? val() : null);

export const nth = (n: number, nth = 2) => (n || 0).toFixed(nth);

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
