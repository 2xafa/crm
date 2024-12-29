import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const Sales = () => {
  const [showModal, setShowModal] = useState(false);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [newSale, setNewSale] = useState({
    customerId: '',
    customerName: '',
    product: '',
    quantity: '',
    amount: ''
  });

  const handleClose = () => {
    setShowModal(false);
    setNewSale({
      customerId: '',
      customerName: '',
      product: '',
      quantity: '',
      amount: ''
    });
    setError('');
    setEditMode(false);
    setSelectedSaleId(null);
  };

  const handleShow = () => setShowModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSale(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomerSelect = (e) => {
    const selectedCustomer = customers.find(c => c._id === e.target.value);
    if (selectedCustomer) {
      setNewSale(prev => ({
        ...prev,
        customerId: selectedCustomer._id,
        customerName: selectedCustomer.name
      }));
    }
  };

  const loadCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/customers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCustomers(response.data);
    } catch (err) {
      console.error('Müşteriler yüklenirken hata oluştu:', err);
    }
  };

  const loadSales = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/sales', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSales(response.data);
    } catch (err) {
      console.error('Satışlar yüklenirken hata oluştu:', err);
    }
  };

  useEffect(() => {
    loadCustomers();
    loadSales();
  }, []);

  const handleSave = async () => {
    try {
      if (!newSale.customerId || !newSale.product || !newSale.quantity || !newSale.amount) {
        setError('Tüm alanları doldurunuz');
        return;
      }

      const token = localStorage.getItem('token');

      if (editMode) {
        await axios.put(`http://localhost:3000/api/sales/${selectedSaleId}`, newSale, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSuccess('Satış başarıyla güncellendi');
      } else {
        await axios.post('http://localhost:3000/api/sales', newSale, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSuccess('Satış başarıyla eklendi');
      }
      
      handleClose();
      loadSales();

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(editMode ? 'Satış güncellenirken bir hata oluştu' : 'Satış eklenirken bir hata oluştu');
    }
  };

  const handleEdit = (sale) => {
    setEditMode(true);
    setSelectedSaleId(sale._id);
    setNewSale({
      customerId: sale.customerId,
      customerName: sale.customerName,
      product: sale.product,
      quantity: sale.quantity,
      amount: sale.amount
    });
    handleShow();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu satışı silmek istediğinizden emin misiniz?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/sales/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setSuccess('Satış başarıyla silindi');
        loadSales();

        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        setError('Satış silinirken bir hata oluştu');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Satışlar</h2>
        <Button variant="primary" onClick={() => {
          setEditMode(false);
          handleShow();
        }}>
          Yeni Satış Ekle
        </Button>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Müşteri</th>
            <th>Ürün</th>
            <th>Miktar</th>
            <th>Tutar</th>
            <th>Tarih</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                Henüz satış bulunmuyor.
              </td>
            </tr>
          ) : (
            sales.map((sale) => (
              <tr key={sale._id}>
                <td>{sale.customerName}</td>
                <td>{sale.product}</td>
                <td>{sale.quantity}</td>
                <td>₺{sale.amount}</td>
                <td>{formatDate(sale.date)}</td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(sale)}
                  >
                    Düzenle
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(sale._id)}
                  >
                    Sil
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Satış Düzenle' : 'Yeni Satış Ekle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Müşteri</Form.Label>
              <Form.Select
                name="customerId"
                value={newSale.customerId}
                onChange={handleCustomerSelect}
                disabled={editMode}
              >
                <option value="">Müşteri seçiniz</option>
                {customers.map(customer => (
                  <option key={customer._id} value={customer._id}>
                    {customer.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ürün</Form.Label>
              <Form.Control
                type="text"
                name="product"
                placeholder="Ürün adı giriniz"
                value={newSale.product}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Miktar</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                placeholder="Miktar giriniz"
                value={newSale.quantity}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tutar</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                placeholder="Tutar giriniz"
                value={newSale.amount}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editMode ? 'Güncelle' : 'Kaydet'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Sales; 