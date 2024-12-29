const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Satış şeması
const saleSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  customerName: { type: String, required: true },
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const Sale = mongoose.model('Sale', saleSchema);

// Tüm satışları getir
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni satış ekle
router.post('/', async (req, res) => {
  try {
    const { customerId, customerName, product, quantity, amount } = req.body;
    
    if (!customerId || !customerName || !product || !quantity || !amount) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    const sale = new Sale({
      customerId,
      customerName,
      product,
      quantity,
      amount
    });

    const newSale = await sale.save();
    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Satış güncelle
router.put('/:id', async (req, res) => {
  try {
    const { customerId, customerName, product, quantity, amount } = req.body;
    
    if (!customerId || !customerName || !product || !quantity || !amount) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    const sale = await Sale.findByIdAndUpdate(
      req.params.id,
      {
        customerId,
        customerName,
        product,
        quantity,
        amount
      },
      { new: true }
    );

    if (!sale) {
      return res.status(404).json({ message: 'Satış bulunamadı' });
    }

    res.json(sale);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Satış sil
router.delete('/:id', async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Satış bulunamadı' });
    }
    res.json({ message: 'Satış başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 