export const nth = (n: number, nth = 2) => (n || 0).toFixed(nth);

export function numPadSpace(n: number, minLength: number) {
    let str = n + '';
    while (str.length < minLength) str = ' ' + str;

    return str;
}
