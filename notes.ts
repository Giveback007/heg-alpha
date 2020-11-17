class Note {
    slowSMA = 0;
    slowSMAarr = [0];
    fastSMA = 0;
    fastSMAarr = [0];
    smaSlope = 0;

    static sma(arr: number[], window: number) {
        const temp: number[] = [];

        arr.forEach((x, i) => {
            // if i is 0 push to temp
            if (i === 0) return temp.push(x);

            // if i < window 
            if (i < window) {
                const arrSlice = arr.slice(0, i + 1);
                const y = arrSlice.reduce((previous, current) => current += previous) / (i + 1);
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
    
    if ((this.ratio[this.ratio.length - 1] < temp[4] * 0.7) || (this.ratio[this.ratio.length - 1] > temp[4] * 1.3)) {
      this.ratio[this.ratio.length - 1] = this.ratio[this.ratio.length - 2]; // Roll the ratio back if outside margin 
      dataArray[rIdx] = temp;
    }
    
    this.filtered.push(dataArray.join(delimiter));
}


function handleEventData(data, delimiter="|", uIdx=0, rIdx=3) { // Can set custom delimiters, time counters (us) index, and ratio index of incoming data.

    if(this.raw[this.raw.length - 1] != data) {  //on new output
      if(this.ui == true){
        document.getElementById("heg").innerHTML = data;
      }
      //Create event for posting data from an iframe implementation of this code.
      var onRead = new CustomEvent('on_read', { detail: {data: data} }); 
      window.parent.dispatchEvent(onRead); 
      window.parent.postMessage(data, "*");

      if(data.includes(delimiter)) { //Checks that it's a data line of specified format
        this.raw.push(data);
        var dataArray = data.split(delimiter);
        var thisRatio = parseFloat(dataArray[rIdx]);
        if(thisRatio > 0) { 
          if(this.startTime == 0) { this.startTime = parseInt(dataArray[0]); }
          this.clock.push(parseInt(dataArray[uIdx]));
          this.ratio.push(parseFloat(dataArray[rIdx]));

          if(this.clock.length > 5) { // SMA filtering for ratio
            var temp = HEGwebAPI.sma(this.ratio.slice(this.ratio.length - 5, this.ratio.length), 5); 
            //console.log(temp);
            if((this.ratio[this.ratio.length - 1] < temp[4] * 0.7) || (this.ratio[this.ratio.length - 1] > temp[4] * 1.3)) {
              this.ratio[this.ratio.length - 1] = this.ratio[this.ratio.length - 2]; // Roll the ratio back if outside margin 
              dataArray[rIdx] = temp;
            } 
            this.filtered.push(dataArray.join(delimiter));
          }
          //handle new data
          this.handleScore();
          if(this.defaultUI == true){
            this.updateStreamRow(dataArray);
          }
        } 
      }
    }
    //handle if data not changed
    else if (this.replay == false) {
      //s.smaSlope = s.scoreArr[s.scoreArr.length - 1];
      //g.graphY1.shift();
      //g.graphY1.push(s.scoreArr[s.scoreArr.length - 1 - g.xoffset]);
      //s.scoreArr.push(s.smaSlope);
    }
    this.endOfEvent();
  }