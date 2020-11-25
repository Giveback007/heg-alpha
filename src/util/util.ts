import { AnyObj, objMap, hasKey } from '@giveback007/util-lib';

export const elm = (id: string) => {
    const el = document.getElementById(id);
    if (!el) {
        console.log('no element with id: ' + id)
        throw 'error'
    }
    
    return el;
};

export const now = () => new Date().getTime();

export const unsubAll = (obj: AnyObj) =>
    objMap(obj, ({ val }) => hasKey(val, 'unsubscribe') ? val.unsubscribe() : null);

export const nth = (n: number, nth = 2) => (n || 0).toFixed(nth);

export function numPadSpace(n: number, minLength: number) {
    let str = n + '';
    while (str.length < minLength) str = ' ' + str;

    return str;
}
