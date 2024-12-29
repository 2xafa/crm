require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const salesRoutes = require('./routes/sales.routes');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:80', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Ana route
app.get('/', (req, res) => {
  res.json({ message: 'Sales Service çalışıyor' });
});

// Routes
app.use('/api/sales', salesRoutes);

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/sales-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB bağlantısı başarılı'))
.catch(err => console.error('MongoDB bağlantı hatası:', err));

// Server başlatma
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Sales Service ${PORT} portunda çalışıyor`);
}); 