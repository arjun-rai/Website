import React, {useEffect, useState} from "react";
import './Data.css';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import {
  TextField
} from '@material-ui/core';
import axios from 'axios';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

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

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(
    () => {
        localStorage.setItem('user', JSON.stringify(user))
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json'
                    }
                })
                .then((res) => {
                    setProfile(res.data);
                    localStorage.setItem('profile', JSON.stringify(res.data))
                })
                .catch((err) => console.log(err));
        }
    },
    [ user ]
  );  

  const logOut = () => {
    googleLogout();
    setProfile(null);
    localStorage.setItem('profile', null)
    localStorage.setItem('user', null)
  };

  const navigate = useNavigate();

  const [isScreenWide, setIsScreenWide] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenWide(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='main'>
     <Navbar expand={isScreenWide} onToggle={handleToggle} expanded={isNavExpanded}>
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
          <Navbar.Toggle aria-controls="basic-navbar-nav" className={applyClass ? "nav-bar-right": ''}/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className={applyClass ? "nav-bar-center" : ""}>
              <Nav.Link href="/Data/Search">Search</Nav.Link>
              <Nav.Link href="/Data/History">History</Nav.Link>
              {isScreenWide ? null : (
              <Nav className="ml-auto">
               {profile ? (
                 <Nav.Link onClick={logOut}>Logout</Nav.Link>
                 // <Button variant='delete' size="sm" onClick={logOut}>Logout</Button>
               ) : (
                 <Nav.Link onClick={login}>Login</Nav.Link>
               )}
             </Nav>
          )}
            </Nav>
          </Navbar.Collapse>
          {!isScreenWide ? null : (
            <Nav className="ml-auto">
              {profile ? (
                <Button variant='delete' size="sm" onClick={logOut}>Logout</Button>
              ) : (
                <Button variant='delete' size="sm" onClick={login}>Sign In!</Button>
              )}
            </Nav>
          )}
         
        </Container>
      </Navbar>
      <div className='center'>
        <div className="landing-page-text">
          Find the perfect product faster
        </div>
        <div className="landing-page-text subtext">
          Quickly find the best products of any kind with GPT enhanced product search
        </div>
        <Button variant='delete' size="md" className="sign-up-button" onClick={()=>profile?navigate('/Data/Search'): login()}>Get started</Button>
      </div>
      <div className="center">
        <img src='/demo_image.png' className="demo-img"/>
      </div>
      <div className="center landing-page-text-small">
          Better Search does the work for you      
      </div>
      <div className="landing-page-text subtext2">
          Search up to 20 sites at once and create a product list including cost, description, and the sites that reference the product.  
      </div>
    </div>
  )
};

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<RobotStats />);


