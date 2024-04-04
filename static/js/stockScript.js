let form;

document.addEventListener("DOMContentLoaded", () => {
    const apiRadio = document.getElementById('api');
    const demoRadio = document.getElementById('demo');

    const apiView = document.getElementById("api-container");
    const demoView = document.getElementById("demo-container");

    form = document.getElementById('apiForm');

    // Radio form swappers
    apiRadio.addEventListener('change', () => {
        demoView.style.display = 'none';
        apiView.style.display = 'block';
        form = document.getElementById('apiForm')
        console.log("switched to api")

    });
    demoRadio.addEventListener('change', () => {
        apiView.style.display = 'none';
        demoView.style.display = 'block';
        form = document.getElementById('demoForm')
        console.log("switched to demo")
    });

    // Submit button listener. Sends a fetch request to the server, which grabs
    // the relevant stock data. It then generates a promise and updates the stock
    // chart using the data.
    document.addEventListener('submit', async (e) => {
        if (form) {
            e.preventDefault() // Prevents HTML submission

            const fd = new FormData(form);
            const urlEncoded = new URLSearchParams(fd).toString();
            console.log('Before fetch:', `/stock/${urlEncoded}`);
    
            const response = await fetch('/stock', {
                method: 'POST',
                body: urlEncoded,
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded'
                }
            });
    
            if (!response.ok) { throw new Error('Network response not OK')};
            console.log('Before fetch:', `/stock/${urlEncoded}`);
            const responsePromise  = (await response).json();
            responsePromise.then(data => {
                const chartData = data.chartData;
                updateChart(chartData, window.option, window.stockChart);
            });
        }
    });

    // Takes a data array, an option object, and a chart.
    // Sets xAxis and series data, sets the option parameters, and unhides the chart.
    function updateChart(data, option, chart) {
        option.xAxis[0].data = data.toReversed().map(data => data[0]);
        option.xAxis[1].data = data.toReversed().map(data => data[0]);
        option.series[0].data = data.toReversed().map(data => [data[1][0], data[1][1], data[1][2], data[1][3]]);
        option.series[1].data = data.toReversed().map(data => data[1][4])
        chart.setOption(option);
        chart.hideLoading();
    }
});

