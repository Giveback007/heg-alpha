import React from 'react';
import { unsubAll } from '@giveback007/util-lib';
import { SmoothieChart, TimeSeries } from "smoothie";
import { heg, linker, State } from '../store';

type S = { };
type P = { } & ReturnType<typeof link>;

class _Chart extends React.Component<P, S> {
    hegSub: any;

    componentWillUnmount() {
        unsubAll(this);
    }

    canvasRef = React.createRef<HTMLCanvasElement>();
    canvasElm: HTMLCanvasElement = null as any;

    t2s = new TimeSeries();
    t10s = new TimeSeries();
    t1m = new TimeSeries();
    t5m = new TimeSeries();
    t10m = new TimeSeries();
    
    updateCanvasSize(cvs = this.canvasElm) {
        cvs.width = window.innerWidth;
        cvs.height = 200
    }

    createTimeline(canvasElm: HTMLCanvasElement) {
        // has "responsive"
        const chart = new SmoothieChart({
            interpolation: 'linear',
            minValueScale: 1.05,
            maxValueScale: 1.05,
            scaleSmoothing: 0.7
        });

        chart.addTimeSeries(this.t10m, {
            strokeStyle: 'rgba(162, 12, 176, 1)',
            lineWidth: 2
        });

        chart.addTimeSeries(this.t5m, {
            strokeStyle: 'rgba(12, 154, 176, 1)',
            lineWidth: 2
        });

        chart.addTimeSeries(this.t1m, {
            strokeStyle: 'rgba(34, 176, 12, 1)',
            lineWidth: 2
        });

        chart.addTimeSeries(this.t10s, {
            strokeStyle: 'rgba(176, 119, 12, 1)',
            lineWidth: 2
        });

        chart.addTimeSeries(this.t2s, {
            strokeStyle: 'rgba(176, 12, 12, 1)',
            fillStyle: 'rgba(176, 12, 12, 0.2)',
            lineWidth: 2
        });

        chart.streamTo(canvasElm, 500);
    }

    componentDidMount() {
        this.canvasElm = this.canvasRef.current || null as any;
        if (!this.canvasElm) throw 'chart canvas not found';
        
        this.updateCanvasSize();
        this.createTimeline(this.canvasElm);

        addEventListener('resize', () => this.updateCanvasSize());

        this.hegSub = heg.subscribe(({ lastVal: x }) => {
            this.t2s.append(x.time, x.sma2s);
            this.t10s.append(x.time, x.sma10s);
            this.t1m.append(x.time, x.sma1m);
            this.t5m.append(x.time, x.sma5m);
            this.t10m.append(x.time, x.sma10m);
        });
    }

    render = (p = this.props) => <canvas
        ref={this.canvasRef}
        style={{
            display: 'block',
            position: 'fixed',
            bottom: 0,
            visibility: p.showGraph ? "initial" : "hidden"
        }}
    />;
}

const link = (s: State) => ({ showGraph: s.showGraph });
export const Chart = linker(link, _Chart);
