require('dotenv').config();
const express = require('express');
const proxyRoutes = require('./src/routes/proxyRoutes'); // ya './routes/proxyRoutes'

const app = express();

app.use(express.json());

// Root endpoint for status check
app.get('/', (req, res) => {
  res.send('its working');
});

// Proxy mount point
app.use('/api/proxy', proxyRoutes);

app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`B2B Proxy Server running on port ${PORT}`);
});

module.exports = app;