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
