import { msToTime } from '@giveback007/util-lib';
import * as React from 'react';
import { HegData } from '../heg-connection';
import { heg } from '../store';
import { now, nth, unsubAll } from '../util/util';

export class Ratio extends React.Component {
    state = {
        val: {} as HegData,
        time: 0,
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
            <h3>sma 2s : {nth(val.sma2s, 3)}</h3>
            <h3>avg 10s: {nth(val.avg10s, 3)}</h3>
            <h3>avg 1m : {nth(val.avg1m, 3)}</h3>
            <h3>avg 5m : {nth(val.avg5m, 3)}</h3>
        </>
    }
}