import React from "react";
import { Link, Outlet } from "react-router-dom";
import './App.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Arjun Rai</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="TimeCapsule">Time Capsule</Nav.Link>
            </Nav>
        </Container>
      </Navbar>
      <Outlet /> 
    </div>
    
  );
}