import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';

const Profile = () => {
  const [user] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: ''
  });

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Profil</h2>
      <Card>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Adınızı giriniz"
                value={user.firstName}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Soyad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Soyadınızı giriniz"
                value={user.lastName}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>E-posta</Form.Label>
              <Form.Control
                type="email"
                placeholder="E-posta adresinizi giriniz"
                value={user.email}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Control
                type="text"
                value={user.role}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Yeni Şifre</Form.Label>
              <Form.Control
                type="password"
                placeholder="Yeni şifrenizi giriniz"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Yeni Şifre (Tekrar)</Form.Label>
              <Form.Control
                type="password"
                placeholder="Yeni şifrenizi tekrar giriniz"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Şifreyi Güncelle
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile; 