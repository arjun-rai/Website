import React, {useEffect, useState} from "react";
import './Data.css';
import { Navbar, Nav, Container, NavDropdown, Button} from 'react-bootstrap';
import {
  AwesomeButton,
  AwesomeButtonProgress,
} from 'react-awesome-button';

import AwesomeButtonStyles from 'react-awesome-button/src/styles/themes/theme-c137/styles.module.scss';

import axios from 'axios';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';

import { GoogleLogin } from '@react-oauth/google';


export default function Login() {
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
            </Nav>
          </Navbar.Collapse>
          <Nav className="ml-auto">
                {profile ? (
                  <Button variant='delete' size="sm" onClick={logOut}>Logout</Button>
                ) : (
                  <Button variant='delete' size="sm" onClick={login}>Sign in with Google!</Button>
                )}
            </Nav>
        </Container>
      </Navbar>
      <div className="login">
      {profile ? (
                <div className='center'>
                    {/* <img src={profile.picture} alt="user image" /> */}
                    <h3>User Logged in</h3>
                    <p>Name: {profile.name}</p>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <div className="login-button">
                      {/* <AwesomeButtonProgress 
                      cssModule={AwesomeButtonStyles} 
                      type="primary"
                      size='large'
                      onPress={() =>logOut()}>
                        Log out
                      </AwesomeButtonProgress> */}
                      <Button variant='delete' size="bg" onClick={() =>logOut()}>Logout</Button>
                    </div>
                </div>
            ) : (
              <div>
              <h1>Login</h1>
              <div className="login-button">
                {/* <AwesomeButtonProgress 
                  cssModule={AwesomeButtonStyles} 
                  type="primary"
                  size='large'
                  onPress={() =>login()}>
                    Sign in with Google!
                  </AwesomeButtonProgress> */}
                  <Button variant='delete' size="bg" onClick={() =>login()}>Sign in with Google!</Button>
              </div>
              </div>
            )}
      </div>
    </div>
  )
};

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<RobotStats />);

