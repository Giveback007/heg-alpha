import { AnyObj, average, msToTime, objMap } from '@giveback007/util-lib';
import { viewSize } from '@giveback007/util-lib/dist/browser';

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

export const timeSma = (data: HegData[], ms: number) => {
    const len = data.length;
    if (!len) return 0;

    const fromTime = data[len - 1].time - ms;
    const ratio: number[] = [];

    let i = len;
    while (i > 0 && data[i - 1].time >= fromTime) {
        i--;
        ratio.push(data[i].ratio);
    }

    return average(ratio);
}
