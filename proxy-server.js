const http = require('http');
const https = require('https');
const url = require('url');

// Function to transform Yahoo Finance data to our expected format
function transformYahooData(yahooData) {
    try {
        // Check if we have valid data
        if (!yahooData.chart || !yahooData.chart.result || yahooData.chart.result.length === 0) {
            throw new Error('Invalid Yahoo Finance data structure');
        }

        const result = yahooData.chart.result[0];
        const timestamps = result.timestamp || [];
        const quotes = result.indicators.quote[0] || {};
        const opens = quotes.open || [];
        const highs = quotes.high || [];
        const lows = quotes.low || [];
        const closes = quotes.close || [];
        const volumes = quotes.volume || [];

        // Create ChartData array in our expected format
        const chartData = [];
        for (let i = 0; i < timestamps.length; i++) {
            // Skip entries with missing data
            if (closes[i] === null || closes[i] === undefined) continue;

            const timestamp = timestamps[i] * 1000; // Convert to milliseconds
            const date = new Date(timestamp);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');

            chartData.push({
                Date: timestamp,
                XLabel: `${hours}:${minutes}`,
                Close: closes[i],
                Open: opens[i] || closes[i],
                High: highs[i] || closes[i],
                Low: lows[i] || closes[i],
                Volume: volumes[i] || 0
            });
        }

        // Find min, max, open, close values
        let openPrice = chartData.length > 0 ? chartData[0].Open : 0;
        let closePrice = chartData.length > 0 ? chartData[chartData.length - 1].Close : 0;
        let maxPrice = Math.max(...chartData.map(item => item.High));
        let minPrice = Math.min(...chartData.map(item => item.Low));

        // Log some stats for debugging
        console.log(`RAJA data: Open=${openPrice}, Close=${closePrice}, Min=${minPrice}, Max=${maxPrice}, Points=${chartData.length}`);

        // Create the transformed data structure
        return {
            ChartData: chartData,
            SecurityCode: "RAJA",
            Period: "1D",
            StartDate: chartData.length > 0 ? chartData[0].Date : 0,
            EndDate: chartData.length > 0 ? chartData[chartData.length - 1].Date : 0,
            OpenPrice: openPrice,
            MaxPrice: maxPrice,
            MinPrice: minPrice,
            Step: 0.0,
            _meta: yahooData._meta
        };
    } catch (e) {
        console.error('Error transforming Yahoo Finance data:', e.message);
        throw e;
    }
}

// Sample data to use as fallback
const sampleData = {
    "ChartData": [
        {"Date": 1747386000000, "XLabel": "9:0", "Close": 2180.0},
        {"Date": 1747386300000, "XLabel": "9:5", "Close": 2160.0},
        {"Date": 1747386600000, "XLabel": "9:10", "Close": 2170.0},
        {"Date": 1747386900000, "XLabel": "9:15", "Close": 2160.0},
        {"Date": 1747387200000, "XLabel": "9:20", "Close": 2160.0},
        {"Date": 1747387500000, "XLabel": "9:25", "Close": 2120.0},
        {"Date": 1747387800000, "XLabel": "9:30", "Close": 2140.0},
        {"Date": 1747388100000, "XLabel": "9:35", "Close": 2130.0},
        {"Date": 1747388400000, "XLabel": "9:40", "Close": 2140.0},
        {"Date": 1747388700000, "XLabel": "9:45", "Close": 2140.0},
        {"Date": 1747389000000, "XLabel": "9:50", "Close": 2150.0},
        {"Date": 1747389300000, "XLabel": "9:55", "Close": 2150.0},
        {"Date": 1747389600000, "XLabel": "10:0", "Close": 2160.0},
        {"Date": 1747389900000, "XLabel": "10:5", "Close": 2150.0},
        {"Date": 1747390200000, "XLabel": "10:10", "Close": 2150.0},
        {"Date": 1747390500000, "XLabel": "10:15", "Close": 2170.0},
        {"Date": 1747390800000, "XLabel": "10:20", "Close": 2160.0},
        {"Date": 1747391100000, "XLabel": "10:25", "Close": 2160.0},
        {"Date": 1747391400000, "XLabel": "10:30", "Close": 2170.0},
        {"Date": 1747391700000, "XLabel": "10:35", "Close": 2170.0},
        {"Date": 1747392000000, "XLabel": "10:40", "Close": 2160.0},
        {"Date": 1747392300000, "XLabel": "10:45", "Close": 2150.0},
        {"Date": 1747392600000, "XLabel": "10:50", "Close": 2150.0},
        {"Date": 1747392900000, "XLabel": "10:55", "Close": 2160.0},
        {"Date": 1747393200000, "XLabel": "11:0", "Close": 2150.0}
    ],
    "SecurityCode": "RAJA",
    "Period": "1D",
    "StartDate": 1747386000000,
    "EndDate": 1747411800000,
    "OpenPrice": 2180.0,
    "MaxPrice": 2190.0,
    "MinPrice": 2120.0,
    "Step": 0.0
};

// Create the server
const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Parse the request URL
    const parsedUrl = url.parse(req.url, true);

    // Check if this is a request for RAJA stock data
    if (parsedUrl.pathname === '/raja-stock') {
        // The Yahoo Finance API URL for RAJA.JK (RAJA on Jakarta Stock Exchange)
        //const apiUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/RAJA.JK?period1=1747231200&period2=1747404000&interval=1m&includePrePost=true&events=div%7Csplit%7Cearn&lang=en-US&region=US&source=cosaic';
            const apiUrl = 'https://query1.finance.yahoo.com/v8/finance/chart/RAJA.JK?interval=1m&range=1d'
        // Set custom headers to mimic a browser request
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://finance.yahoo.com/',
                'Origin': 'https://finance.yahoo.com'
            }
        };

        // Make the request to the Yahoo Finance API
        const apiReq = https.get(apiUrl, options, (apiRes) => {
            let data = '';

            // Check if we got a successful response
            if (apiRes.statusCode !== 200) {
                console.error(`Yahoo Finance API returned status code: ${apiRes.statusCode}`);

                // Return sample data with error info
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    ...sampleData,
                    _meta: {
                        source: 'sample',
                        error: `Yahoo Finance API returned status code: ${apiRes.statusCode}`,
                        message: 'Using sample data due to API error'
                    }
                }));
                return;
            }

            // A chunk of data has been received
            apiRes.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received
            apiRes.on('end', () => {
                try {
                    // Try to parse the response as JSON
                    const jsonData = JSON.parse(data);

                    // Add metadata
                    jsonData._meta = {
                        source: 'api',
                        provider: 'yahoo',
                        timestamp: new Date().toISOString()
                    };

                    // Transform Yahoo Finance data to our expected format
                    const transformedData = transformYahooData(jsonData);

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(transformedData));
                } catch (e) {
                    console.error('Error parsing Yahoo Finance API response:', e.message);
                    console.error('Response data:', data.substring(0, 200) + '...');

                    // Check if this is an error page
                    if (data.includes('error') || data.includes('denied')) {
                        console.error('Detected error page in response');
                    }

                    // Return sample data with error info
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        ...sampleData,
                        _meta: {
                            source: 'sample',
                            error: 'Failed to parse API response',
                            message: 'Using sample data due to API error',
                            details: e.message
                        }
                    }));
                }
            });
        });

        apiReq.on('error', (err) => {
            console.error('Error fetching data from Yahoo Finance API:', err.message);

            // Return sample data with error info
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                ...sampleData,
                _meta: {
                    source: 'sample',
                    error: 'Network error',
                    message: 'Using sample data due to network error',
                    details: err.message
                }
            }));
        });

        // Set a timeout for the request
        apiReq.setTimeout(10000, () => {
            // Only respond if headers haven't been sent yet
            if (!res.headersSent) {
                apiReq.destroy();
                console.error('Request to Yahoo Finance API timed out');

                // Return sample data with error info
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    ...sampleData,
                    _meta: {
                        source: 'sample',
                        error: 'Request timeout',
                        message: 'Using sample data due to API timeout'
                    }
                }));
            }
        });
    } else {
        // Not a valid endpoint
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});



// Start the server on port 3002
server.listen(3002, () => {
    console.log(`Proxy server running at http://localhost:3002`);
    console.log(`To get RAJA stock data, use: http://localhost:3002/raja-stock`);
});
