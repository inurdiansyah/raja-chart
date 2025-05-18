# RAJA Stock Chart

This project displays a stock chart for RAJA (Rukun Raharja Tbk.) using data from the Yahoo Finance API, with fallback to sample data when the API is unavailable.

## Preview

![RAJA Stock Chart Preview](https://tinypic.host/images/2025/05/18/Screenshot-2025-05-18-225241.png)

*Screenshot of the RAJA stock chart showing candlestick view with volume indicator*

## Features

- Interactive stock chart using lightweight-charts library
- Toggle between candlestick and line chart views
- Volume indicator
- Summary statistics (Open, High, Low, Close, Change)
- Responsive design
- Graceful fallback to sample data when API is unavailable

## Files

- `raja_chart_yfproxy.html` - The main chart implementation using Yahoo Finance API data via proxy server
- `proxy-server.js` - A simple proxy server to handle CORS issues with the Yahoo Finance API
- `raja_chart_yahoo(failed).html` - Implementation that attempts to use Yahoo Finance API directly (has CORS issues)
- `raja_chart_stockdio(not free).html` - Alternative implementation using Stockdio API (requires subscription)
- `chart-import.html` - Simple example of importing the lightweight-charts library
- `chart-module.html` - Example of using lightweight-charts as a module
- `chart.js` - JavaScript module for chart functionality
- `index.html` - Basic HTML template for the chart

## How to Use

### Option 1: With Proxy Server (Live Data)

1. Start the proxy server:
   ```
   node proxy-server.js
   ```
   You should see: `Proxy server running at http://localhost:3002`

2. Open `raja_chart_yfproxy.html` in your browser
   - The chart will fetch live data from the Yahoo Finance API through the proxy server
   - If the Yahoo Finance API is unavailable or returns an error, it will automatically fall back to sample data

### Option 2: Without Proxy Server (Sample Data)

1. Simply open `raja_chart_yfproxy.html` in your browser
   - The chart will automatically use sample data
   - A warning message will be displayed indicating that sample data is being used

## API Endpoints

- Yahoo Finance API: `https://query1.finance.yahoo.com/v8/finance/chart/RAJA.JK?interval=1m&range=1d`
- Local proxy: `http://localhost:3002/raja-stock`

## Known Issues

### Yahoo Finance API Limitations

The Yahoo Finance API has some limitations to be aware of:

1. The API has rate limits that may cause requests to be rejected if too many are made
2. Historical data may not be available for all time periods
3. The API format may change without notice

If the API is unavailable, the chart will automatically fall back to using sample data and display a warning message.

### CORS Error

If you see a CORS error in the console, it means the browser cannot directly access the Yahoo Finance API due to cross-origin restrictions. To fix this:

1. Make sure the proxy server is running
2. Check that the chart is configured to use the correct proxy URL (`http://localhost:3002/raja-stock`)

### Port Already in Use

If you see an error like `Error: listen EADDRINUSE: address already in use :::3002` when starting the proxy server, it means:

1. The proxy server is already running in another process, or
2. Another application is using port 3002

You'll need to modify the port in the proxy-server.js file (line 257) to use a different port.

## Alternative Data Sources

If you need reliable live data, consider using one of these alternatives:

1. **Stockdio API** - See `raja_chart_local.html` for an implementation using this API
2. **IDX.co.id API** - Direct API from Indonesia Stock Exchange: `https://www.idx.co.id/primary/helper/GetStockChart?indexCode=RAJA&period=1D`
3. **Alpha Vantage** - Provides free API access to financial market data

## Dependencies

- [lightweight-charts](https://github.com/tradingview/lightweight-charts) - TradingView's charting library
