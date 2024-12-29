const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Müşteri şeması
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model('Customer', customerSchema);

// Tüm müşterileri getir
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Yeni müşteri ekle
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;
    
    if (!name || !email || !phone || !company) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    const customer = new Customer({
      name,
      email,
      phone,
      company
    });

    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Müşteri güncelle
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;
    
    if (!name || !email || !phone || !company) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        phone,
        company
      },
      { new: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }

    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Müşteri sil
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }
    res.json({ message: 'Müşteri başarıyla silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 