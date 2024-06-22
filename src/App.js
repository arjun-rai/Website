import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import './App.css';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const location = useLocation();
  return (
    <div>
      {!location.pathname.startsWith("/Data") && (
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Arjun Rai</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="TimeCapsule">Time Capsule</Nav.Link>
            <Nav.Link href="RobotStats">Robot Statistics</Nav.Link>
            <Nav.Link href="Data">Data</Nav.Link>
            {/* <Nav.Link href="PortfolioPage">Portfolio</Nav.Link> */}
            </Nav>
        </Container>
      </Navbar>
      )}
      <Outlet /> 
    </div>
    
  );
}