require('dotenv').config();
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();

// CORS ayarları
app.use(cors({
  origin: ['http://localhost:80', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Ana route
app.get('/', (req, res) => {
  res.json({ message: 'API Gateway çalışıyor' });
});

// Auth Service proxy
app.use('/api/auth', proxy('http://auth-service:3001', {
  proxyReqPathResolver: (req) => {
    return `/api/auth${req.url}`;
  }
}));

// Customer Service proxy
app.use('/api/customers', proxy('http://customer-service:3002', {
  proxyReqPathResolver: (req) => {
    return `/api/customers${req.url}`;
  }
}));

// Sales Service proxy
app.use('/api/sales', proxy('http://sales-service:3003', {
  proxyReqPathResolver: (req) => {
    return `/api/sales${req.url}`;
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Gateway ${PORT} portunda çalışıyor`);
}); 