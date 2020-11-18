import { msToTime } from '@giveback007/util-lib';
import * as React from 'react';
import { HegData } from '../heg-connection';
import { heg } from '../store';
import { now, nth, unsubAll } from '../util/util';

export class Ratio extends React.Component {
    state = {
        val: {} as HegData,
        time: null as number,
    };

    hegSub: any;

    componentWillUnmount() {
        unsubAll(this);
    }

    componentDidMount() {
        this.hegSub = heg.subscribe(({ lastVal: val, timeConnected: time }) => this.setState({ val, time }))
    }


    render({ val, time } = this.state) {
        const t = time ? msToTime(now() - time) : null;
        
        return <>
            <h4>Time: {t}</h4>
            <h3>SMA 1s : {nth(val.sma1s, 3)}</h3>
            <h3>SMA 5s : {nth(val.sma5s, 3)}</h3>
            <h3>SMA 10s: {nth(val.sma10s, 3)}</h3>
            <h3>SMA 30s: {nth(val.sma30s, 3)}</h3>
            <h3>SMA 1m : {nth(val.sma1m, 3)}</h3>
            <h3>SMA 5m : {nth(val.sma5m, 3)}</h3>
        </>
    }
}