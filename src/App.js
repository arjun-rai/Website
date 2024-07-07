import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import './App.css';
import { Navbar, Nav, Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const location = useLocation();
  return (
    <div>
      {(!location.pathname.startsWith("/Data")) && (
      <Navbar bg="dark" variant="dark" expand='lg'>
        <Container>
          <Navbar.Brand className='main-menu' href="/">Arjun Rai</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className='main-menu' href="/">Home</Nav.Link>
            <Nav.Link className='main-menu' href="TimeCapsule">Time Capsule</Nav.Link>
            <Nav.Link className='main-menu' href="RobotStats">Robot Statistics</Nav.Link>
            <Nav.Link className='main-menu' href="Data">Data</Nav.Link>
            {/* <Nav.Link href="PortfolioPage">Portfolio</Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      )}
      <Outlet /> 
    </div>
    
  );
}