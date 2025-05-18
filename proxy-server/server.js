const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Yahoo Finance proxy endpoint
app.get('/yahoo-finance', async (req, res) => {
  try {
    const symbol = req.query.symbol || 'RAJA.JK';
    const interval = req.query.interval || '1m';
    const range = req.query.range || '1d';
    
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${range}`;
    
    console.log(`Proxying request to: ${url}`);
    
    const response = await fetch(url);
    const data = await response.json();
    
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch data from Yahoo Finance',
      message: error.message 
    });
  }
});

// Root route for testing
app.get('/', (req, res) => {
  res.send('Yahoo Finance Proxy Server is running. Use /yahoo-finance?symbol=SYMBOL&interval=INTERVAL&range=RANGE');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
