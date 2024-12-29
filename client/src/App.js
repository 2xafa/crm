import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Customers from './components/Customers';
import Sales from './components/Sales';
import Profile from './components/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const isAuthenticated = localStorage.getItem('token');

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
  };

  const AuthLayout = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/" />;

    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/dashboard">CRM Sistemi</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link href="/customers">Müşteriler</Nav.Link>
                <Nav.Link href="/sales">Satışlar</Nav.Link>
                <Nav.Link href="/profile">Profil</Nav.Link>
                <Nav.Link
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                  }}
                >
                  Çıkış
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        {children}
      </>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <AuthLayout>
                <Dashboard />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <AuthLayout>
                <Customers />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <PrivateRoute>
              <AuthLayout>
                <Sales />
              </AuthLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <AuthLayout>
                <Profile />
              </AuthLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App; 