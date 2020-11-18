import React = require('react');
import { SmoothieChart, TimeSeries } from "smoothie";
import { store, heg } from '../store';
import { unsubAll } from '../util/util';

type S = { showGraph: boolean; }

export class Chart extends React.Component<{}, S> {
    state = { showGraph: false, }

    storeSub: any;
    hegSub: any;

    componentWillUnmount() {
        unsubAll(this);
    }

    canvasRef = React.createRef<HTMLCanvasElement>();
    canvasElm: HTMLCanvasElement = null as any;

    ratio = new TimeSeries();
    t1s = new TimeSeries();
    t10s = new TimeSeries();
    t1m = new TimeSeries();
    t5m = new TimeSeries();
    
    updateCanvasSize(cvs = this.canvasElm) {
        cvs.width = window.innerWidth;
        cvs.height = 200
    }

    createTimeline(canvasElm: HTMLCanvasElement) {
        // has "responsive"
        const chart = new SmoothieChart({
            minValue: 0,
            maxValue: 1.5
            // responsive: true
        });

        chart.addTimeSeries(this.ratio, {
            strokeStyle: 'rgba(168, 50, 50, 1)',
            // fillStyle: 'rgba(168, 50, 50, 0.2)',
            lineWidth: 2
        });

        chart.addTimeSeries(this.t10s, {
            strokeStyle: 'rgba(168, 50, 131, 1)',
            // fillStyle: 'rgba(168, 50, 131, 0.2)',
            lineWidth: 2
        });

        chart.addTimeSeries(this.t1m, {
            strokeStyle: 'rgba(168, 148, 50, 1)',
            // fillStyle: 'rgba(168, 148, 50, 0.2)',
            lineWidth: 2
        });

        chart.addTimeSeries(this.t5m, {
            strokeStyle: 'rgba(50, 168, 164, 1)',
            // fillStyle: 'rgba(50, 168, 164, 0.2)',
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

        this.storeSub = store.subscribe(({ showGraph }) => this.setState({ showGraph }));
        this.hegSub = heg.subscribe(({ lastVal: x }) => { 
            this.ratio.append(x.time, x.sma10);
            this.t1s.append(x.time, x.sma1s);
            this.t10s.append(x.time, x.sma10s);
            this.t1m.append(x.time, x.sma1m);
            this.t5m.append(x.time, x.sma5m);
        });
    }

    render = (s = this.state) => <canvas
        ref={this.canvasRef}
        style={{
            display: 'block',
            position: 'fixed',
            bottom: 0,
            visibility: s.showGraph ? "initial" : "hidden"
        }}
    />;
    
}
