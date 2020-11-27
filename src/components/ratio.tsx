import * as React from 'react';
import { min, msToTime, sec } from '@giveback007/util-lib';
import { heg } from '../store';
import { nth, unsubAll } from '../util/util';
import { HegData } from '../heg-connection.type';

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
        const t = Date.now() - time;
        const strTime = time ? msToTime(t) : null;
        
        return <>
            <h4>Time: {strTime}</h4>
            <h3 style={{color: 'rgb(176, 12, 12)'}}>sma 3s : {t > sec(0.5) ? nth(val.sma3s, 3) : null}</h3>
            <h3 style={{color: 'rgb(176, 119, 12)'}}>avg 10s: {t > sec(3) ? nth(val.avg10s, 3) : null}</h3>
            <h3 style={{color: 'rgb(34, 176, 12)'}}>avg 1m : {t > sec(10) ? nth(val.avg1m, 3) : null}</h3>
            <h3 style={{color: 'rgb(12, 154, 176)'}}>avg 5m : {t > min(1) ? nth(val.avg5m, 3) : null}</h3>
            <h3 style={{color: 'rgb(162, 12, 176)'}}>avg 10m: {t > min(5) ? nth(val.avg10m, 3) : null}</h3>
        </>
    }
}