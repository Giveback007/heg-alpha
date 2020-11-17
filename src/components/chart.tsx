import React = require('react');
import { SmoothieChart, TimeSeries } from "smoothie";
import { store, heg } from '../store';

export const chartT = new TimeSeries();

type S = { showGraph: boolean; }

export class Chart extends React.Component<{}, S> {
    state = { showGraph: false, }

    storeSub: any;
    hegSub: any;

    componentWillUnmount() {
        this.storeSub.unsubscribe();
    }

    canvasRef = React.createRef<HTMLCanvasElement>();
    canvasElm: HTMLCanvasElement = null as any;
    timeSeries = chartT;//new TimeSeries();
    
    updateCanvasSize(cvs = this.canvasElm) {
        cvs.width = window.innerWidth;
        cvs.height = 200
    }

    createTimeline(canvasElm: HTMLCanvasElement) {
        // has "responsive"
        const chart = new SmoothieChart({
            minValue: 0,
            // responsive: true
        });

        chart.addTimeSeries(this.timeSeries, {
            strokeStyle: 'rgba(0, 255, 0, 1)',
            fillStyle: 'rgba(0, 255, 0, 0.2)',
            lineWidth: 5
        });

        chart.streamTo(canvasElm, 500);
    }

    componentDidMount() {
        this.canvasElm = this.canvasRef.current || null as any;
        if (!this.canvasElm) throw 'chart canvas not found';
        
        this.updateCanvasSize();
        this.createTimeline(this.canvasElm);

        addEventListener('resize', () => this.updateCanvasSize());

        this.hegSub = heg.subscribe(({ lastVal }) => { this.timeSeries.append(lastVal.time, lastVal.sma30) });
        this.storeSub = store.subscribe(({ showGraph }) => this.setState({ showGraph }));
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
