export type HegData = {
    sma3s: number;
    avg10s: number;
    avg1m: number;
    avg5m: number;
    avg10m: number;
    time: number;
    red: number;
    ir: number;
    ratio: number;
}

export type HegState = {
    data: HegData[];
    isReading: boolean;
    isConnected: boolean;
    lastVal: HegData;
    showBtStats: boolean;
    timeConnected: number;
    SPS: number;
    ufSPS: number;
}

/** [red, ir, ratio] */
export type HegTuple = [number, number, number];
