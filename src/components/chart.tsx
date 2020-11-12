import React = require('react');
import { SmoothieChart, TimeSeries } from "smoothie";

export class Chart extends React.Component<{}, {}> {

    canvasRef = React.createRef<HTMLCanvasElement>();
    canvasElm: HTMLCanvasElement = null as any;
    random = new TimeSeries();
    
    updateCanvasSize(cvs = this.canvasElm) {
        cvs.width = window.innerWidth;
        cvs.height = 150
    }

    createTimeline(canvasElm: HTMLCanvasElement) {
        var chart = new SmoothieChart();
        chart.addTimeSeries(this.random, {
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

        // Randomly add a data point every 500ms
        setInterval(() => {
            this.random.append(new Date().getTime(), Math.random() * 10000);
        }, 500);

        addEventListener('resize', () => this.updateCanvasSize());
    }

    render = () => <canvas
        ref={this.canvasRef}
        style={{
            display: 'block',
            position: 'fixed',
            bottom: 0
        }}
    />;
    
}