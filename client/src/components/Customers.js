import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const Customers = () => {
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: ''
  });

  const handleClose = () => {
    setShowModal(false);
    setNewCustomer({
      name: '',
      email: '',
      phone: '',
      company: ''
    });
    setError('');
    setEditMode(false);
    setSelectedCustomerId(null);
  };

  const handleShow = () => setShowModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));
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

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (editMode) {
        await axios.put(`http://localhost:3000/api/customers/${selectedCustomerId}`, newCustomer, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSuccess('Müşteri başarıyla güncellendi');
      } else {
        await axios.post('http://localhost:3000/api/customers', newCustomer, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSuccess('Müşteri başarıyla eklendi');
      }
      
      handleClose();
      loadCustomers();

      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError(editMode ? 'Müşteri güncellenirken bir hata oluştu' : 'Müşteri eklenirken bir hata oluştu');
    }
  };

  const handleEdit = (customer) => {
    setEditMode(true);
    setSelectedCustomerId(customer._id);
    setNewCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company
    });
    handleShow();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/api/customers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setSuccess('Müşteri başarıyla silindi');
        loadCustomers();

        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        setError('Müşteri silinirken bir hata oluştu');
      }
    }
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Müşteriler</h2>
        <Button variant="primary" onClick={() => {
          setEditMode(false);
          handleShow();
        }}>
          Yeni Müşteri Ekle
        </Button>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Ad Soyad</th>
            <th>E-posta</th>
            <th>Telefon</th>
            <th>Şirket</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Henüz müşteri bulunmuyor.
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.company}</td>
                <td>
                  <Button 
                    variant="info" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(customer)}
                  >
                    Düzenle
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(customer._id)}
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
          <Modal.Title>{editMode ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ad Soyad</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Ad Soyad giriniz"
                value={newCustomer.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>E-posta</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="E-posta giriniz"
                value={newCustomer.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                placeholder="Telefon giriniz"
                value={newCustomer.phone}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Şirket</Form.Label>
              <Form.Control
                type="text"
                name="company"
                placeholder="Şirket adı giriniz"
                value={newCustomer.company}
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

export default Customers; 