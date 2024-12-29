import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalSales: 0,
    monthlyIncome: 0
  });

  const loadCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/customers', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCustomers(response.data);
      setStats(prev => ({
        ...prev,
        totalCustomers: response.data.length
      }));
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

      // Toplam satış sayısı
      const totalSales = response.data.length;

      // Aylık gelir hesaplama
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthlyIncome = response.data
        .filter(sale => new Date(sale.date) >= firstDayOfMonth)
        .reduce((total, sale) => total + Number(sale.amount), 0);

      setStats(prev => ({
        ...prev,
        totalSales,
        monthlyIncome
      }));
    } catch (err) {
      console.error('Satışlar yüklenirken hata oluştu:', err);
    }
  };

  useEffect(() => {
    loadCustomers();
    loadSales();

    // Her 30 saniyede bir verileri güncelle
    const interval = setInterval(() => {
      loadCustomers();
      loadSales();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Toplam Müşteri</Card.Title>
              <Card.Text className="h2">{stats.totalCustomers}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Toplam Satış</Card.Title>
              <Card.Text className="h2">{stats.totalSales}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Aylık Gelir</Card.Title>
              <Card.Text className="h2">{formatCurrency(stats.monthlyIncome)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Son Müşteriler</Card.Title>
              {customers.length === 0 ? (
                <Card.Text>Henüz müşteri bulunmuyor.</Card.Text>
              ) : (
                <ListGroup variant="flush">
                  {customers.slice(0, 5).map(customer => (
                    <ListGroup.Item key={customer._id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{customer.name}</strong>
                        <br />
                        <small className="text-muted">{customer.company}</small>
                      </div>
                      <small className="text-muted">
                        {formatDate(customer.createdAt)}
                      </small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Son Satışlar</Card.Title>
              {sales.length === 0 ? (
                <Card.Text>Henüz satış bulunmuyor.</Card.Text>
              ) : (
                <ListGroup variant="flush">
                  {sales.slice(0, 5).map(sale => (
                    <ListGroup.Item key={sale._id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{sale.customerName}</strong>
                        <br />
                        <small className="text-muted">{sale.product} - {sale.quantity} adet</small>
                      </div>
                      <div className="text-end">
                        <strong>{formatCurrency(sale.amount)}</strong>
                        <br />
                        <small className="text-muted">
                          {formatDate(sale.date)}
                        </small>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard; 