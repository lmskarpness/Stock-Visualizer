// Initialize the echarts instance based on the prepared dom
var stockChart = echarts.init(document.getElementById('stockChart'));
var option;

// Option object, provides tools and axis data; styling
option = {
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' },
  },
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 10,
  textStyle: {
    color: '#000'
  },
  grid: [
    {
      height: '50%'
    },
    {
      top: '73%',
      height: '16%'
    }
  ],
  xAxis: [
    {
      data: [],
    },
    {
      gridIndex: 1,
      data: [],
      axisLine: { onZero: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
    }
  ],
  yAxis: [
    {
      scale: true,
      splitArea: {
        show: true
      }
    },
    {
      scale: true,
      gridIndex: 1,
      splitNumber: 2,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false }     
    },
  ],
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0, 1],
      start: 90,
      end: 100
    },
    {
      show: true,
      xAxisIndex: [0, 1],
      type: 'slider',
      top: '90%',
      start: 90,
      end: 100
    }
  ],
  series: [
    {
      type: 'candlestick',
      data: [],
    },
    {
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: []
    }
  ],
};

// Initialize chart (loading and empty)
stockChart.showLoading();

// Split the raw data into time, price, and volume
function splitData(data) {
  let ret = {
    timeData: data.toReversed().map(data => data[0]),
    prices: data.toReversed().map(data => [data[1][0], data[1][1], data[1][2], data[1][3]]),
    volumes: option.series[1].data = data.toReversed().map(data => data[1][4]),
  }
  return ret;
}

// Update the chart options to render the time series
function updateChart(rawData) {
  var data = splitData(rawData);
  option.xAxis[0].data = data.timeData;
  option.xAxis[1].data = data.timeData;
  option.series[0].data = data.prices;
  option.series[1].data = data.volumes;
  chart.setOption(option);
  chart.hideLoading();
}

// Global access to chart and options.
window.option = option;
window.stockChart = stockChart;
