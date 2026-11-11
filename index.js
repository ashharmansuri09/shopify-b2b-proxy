require('dotenv').config();
const express = require('express');
// './routes/proxyRoutes' ki jagah './src/routes/proxyRoutes'
const proxyRoutes = require('./src/routes/proxyRoutes');

const app = express();

// Proxy payloads are application/json
app.use(express.json());

// Proxy mount point
app.use('/api/proxy', proxyRoutes);

app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`B2B Proxy Server running on port ${PORT}`);
});