
const PORT = process.env.PORT || 7373;
const express = require('express');
const axios = require('axios');
const server = express();

server.set('port', PORT);

// Parse JSON bodies (API)
server.use(express.json());
server.use(express.urlencoded({
  extended: false,
  limit: 10000,
}));

// Redirect urls to appropriate locations.
server.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
server.use('/echart', express.static(__dirname + '/node_modules/echarts/dist'));
server.use('/js', express.static(__dirname + '/static/js'));
server.use('/html', express.static(__dirname + '/static/html'));

// Root server, sends the app page.
server.get('/', (request, response) => {
  response.sendFile('static/html/index.html', {root: __dirname });
});

server.post('/stock', async (request, response) => {
  try {
    // Retrieve form data and generate the API endpoint URL for the requested data
    const data = request.body;
    const symbol = data.symbol;
    const timeStep = data.time;
    let timeFunction = `TIME_SERIES_${timeStep}`;
    const apiKey = data.apiKey;

    const url = `https://www.alphavantage.co/query?function=${timeFunction}&symbol=${symbol}&apikey=${apiKey}`;

    // Make axios get call to API then save the data
    const apiResponse = await axios.get(url);
    const responseData = await apiResponse.data;
    
    // Dynamically grab the time series key
    const timeSeriesKey = Object.keys(responseData).find(key =>
      key.includes('Time Series')
    );

    if (!timeSeriesKey) {
      throw new Error('Time series data not found in API response');
    }

    const timeSeriesData = responseData[timeSeriesKey];
    console.log(timeSeriesData);

    // Build the data array according to echart specifications. This could probably be done client-side?
    const chartData = [];
    for (const timestamp in timeSeriesData) {
      const data = timeSeriesData[timestamp];
      // Alpha Vantage is structured OHLCV, charting structured COLH
      const newData = [timestamp, [parseFloat(data['4. close']), parseFloat(data['1. open']), parseFloat(data['3. low']), parseFloat(data['2. high']), parseInt(data['5. volume'])]];
      chartData.push(newData);
    }
    
    // Return the data as json content
    response.setHeader('Content-Type', 'application/json');
    response.status(200).json({ chartData });
  } catch (e) {
    console.error('Error: ', e);
    response.status(500).json({ error: 'An error occurred while fetching API data.'})
  }
});

server.use((request, response) => {
  response.type('text/plain');
  response.status(500);
  response.send('Error');
});
server.use((request, response) => {
  response.type('text/plain');
  response.status(404);
  response.send('Not Found');
});

server.listen(PORT, () => {
    console.log('Node server created at port ' + PORT);
});
