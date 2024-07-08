import React, {useEffect, useState} from "react";
import './Data.css';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import {
  TextField
} from '@material-ui/core';

export default function Home() {
  useEffect(() => {
    document.body.className= 'bodyData'
  }, []);
  
 

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [profile, setProfile] = useState(() => {
    const storedProfile = localStorage.getItem('profile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  });
  const [isNavExpanded, setIsNavExpanded] = useState(false); // State to track navbar collapse
  const [applyClass, setApplyClass] = useState(true); // Initially set to true to apply the class when collapsed

  // Function to handle the toggle with a delay
  const handleToggle = () => {
    setIsNavExpanded(prev => !prev);
    if (isNavExpanded) {
      // Apply class with a delay when collapsing
      setTimeout(() => {
        setApplyClass(true);
      }, 350); // Adjust the timeout to match your CSS transition duration
    } else {
      // Remove class immediately when expanding
      setApplyClass(false);
    }
  };
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = '/logo.ico';
  }, []);

  const navigate = useNavigate();

  return (
    <div className='main'>
     <Navbar expand='lg' onToggle={handleToggle} expanded={isNavExpanded}>
        <Container className='relative-container'>
          <Navbar.Brand href="/Data">
            <img
              alt=""
              src="/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
             <span className="logo-text">Better Search</span>
            </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={applyClass ? "nav-bar-center" : ""}>
          <Nav.Link href="/Data/Search">Search</Nav.Link>
            <Nav.Link href="/Data/History">History</Nav.Link>
            <Nav.Link href="/Data/Login">{profile? ("Logout"): ("Login")}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className='center'>
        <div className="landing-page-text">
          Find the perfect product faster
        </div>
        <div className="landing-page-text subtext">
          Quickly find the best products of any kind with GPT enhanced product search
        </div>
        <Button variant='delete' size="md" className="sign-up-button" onClick={()=>navigate(profile ? '/Data/Search' : '/Data/Login')}>Get started</Button>
      </div>
    </div>
  )
};

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<RobotStats />);



