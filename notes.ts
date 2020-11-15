class Note {
    slowSMA = 0;
    slowSMAarr = [0];
    fastSMA = 0;
    fastSMAarr = [0];
    smaSlope = 0;

    static sma(arr: number[], window: number) {
        const temp: number[] = [];

        arr.forEach((x, i) => {
            if (i === 0) return temp.push(x);

            if (i < window) {
                const arrSlice = arr.slice(0, i + 1);
                const y = arrSlice.reduce((previous,current) => current += previous ) / (i + 1);
                temp.push(y);
            } else {
                const arrSlice = arr.slice(i - window, i);
                const y = arrSlice.reduce((previous, current) => current += previous);
                temp.push(y / window);
            }
        });

        return temp;
    }

    smaScore(input: number[]) {
        this.slowSMAarr = HEGwebAPI.sma(input, 40);
        this.fastSMAarr = HEGwebAPI.sma(input, 20);
        this.fastSMA = this.fastSMAarr[this.fastSMAarr.length - 1];
        this.slowSMA = this.slowSMAarr[this.slowSMAarr.length - 1];
    
        this.smaSlope = this.fastSMA - this.slowSMA;
        // this.scoreArr.push(this.scoreArr[this.scoreArr.length-1]+this.smaSlope);
    }
}

if(this.clock.length > 5) { // SMA filtering for ratio
    var temp = HEGwebAPI.sma(this.ratio.slice(this.ratio.length - 5, this.ratio.length), 5); 
    //console.log(temp);
    if((this.ratio[this.ratio.length - 1] < temp[4] * 0.7) || (this.ratio[this.ratio.length - 1] > temp[4] * 1.3)) {
      this.ratio[this.ratio.length - 1] = this.ratio[this.ratio.length - 2]; // Roll the ratio back if outside margin 
      dataArray[rIdx] = temp;
    } 
    this.filtered.push(dataArray.join(delimiter));
}