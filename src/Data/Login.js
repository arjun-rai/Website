import React, {useEffect, useState} from "react";
import './Data.css';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import axios from 'axios';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

export default function Login() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [profile, setProfile] = useState(() => {
    const storedProfile = localStorage.getItem('profile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  });
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [applyClass, setApplyClass] = useState(true);
  const [isScreenWide, setIsScreenWide] = useState(window.innerWidth > 768);

  useEffect(() => {
    document.body.className= 'bodyData'
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

  const handleToggle = () => {
    setIsNavExpanded(prev => !prev);
    if (isNavExpanded) {
      setTimeout(() => {
        setApplyClass(true);
      }, 350);
    } else {
      setApplyClass(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      const newIsScreenWide = window.innerWidth > 768;
      
      // If transitioning from mobile to desktop AND navbar is expanded
      if (newIsScreenWide && !isScreenWide) {
        // Force close navbar and reset state
        setIsNavExpanded(false);
        setApplyClass(true);
        
        // Additional reset to fix any potential styling issues
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse) {
          navbarCollapse.style.height = '';
          navbarCollapse.style.minHeight = '';
          navbarCollapse.classList.remove('show');
        }
      }
      
      setIsScreenWide(newIsScreenWide);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isScreenWide, isNavExpanded]);

  // Close navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.querySelector('.navbar-collapse');
      const toggleButton = document.querySelector('.navbar-toggler');
      
      if (isNavExpanded && navbar && !navbar.contains(event.target) && 
          toggleButton && !toggleButton.contains(event.target)) {
        setIsNavExpanded(false);
        setTimeout(() => {
          setApplyClass(true);
        }, 350);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavExpanded]);

  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = '/logo.ico';
    document.title = 'Better Search - Login';
  }, []);

  return (
    <div className='main'>
     <Navbar expand={isScreenWide} onToggle={handleToggle} expanded={isNavExpanded} className="custom-navbar">
        <Container>
          <Navbar.Brand href="/Data" className="brand-container">
            <img
              alt=""
              src="/logo.svg"
              width="30"
              height="30"
              className="d-inline-block align-top brand-logo"
            />
            <span className="logo-text">Better Search</span>
          </Navbar.Brand>
          
          <Navbar.Toggle 
            aria-controls="basic-navbar-nav" 
            className="custom-toggler"
          />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="nav-links">
              {profile && (
                <div className="nav-items">
                  <Nav.Link href="/Data/Search">Search</Nav.Link>
                  <Nav.Link href="/Data/History">History</Nav.Link>
                </div>
              )}
              {!isScreenWide && (
                <div className="mobile-auth">
                  {profile ? (
                    <Nav.Link onClick={logOut}>Logout</Nav.Link>
                  ) : (
                    <Nav.Link onClick={login}>Login</Nav.Link>
                  )}
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
          
          {isScreenWide && (
            <div className="desktop-auth">
              {profile ? (
                <Button variant='delete' size="sm" onClick={logOut}>Logout</Button>
              ) : (
                <Button variant='delete' size="sm" onClick={login}>Sign In</Button>
              )}
            </div>
          )}
        </Container>
      </Navbar>

      <motion.div 
        className="login"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
      {profile ? (
        <motion.div 
          className='center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.div 
            className="profile-avatar"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            {profile.picture && (
              <img src={profile.picture} alt="Profile" className="avatar-image" />
            )}
          </motion.div>
          
          <motion.h3 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Welcome back!
          </motion.h3>
          
          <motion.div 
            className="profile-info"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="profile-field">
              <span className="field-label">Name</span>
              <span className="field-value">{profile.name}</span>
            </div>
            
            <div className="profile-field">
              <span className="field-label">Email</span>
              <span className="field-value">{profile.email}</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="login-button"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant='delete' size="lg" onClick={logOut}>
                Sign Out
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          className="login-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Welcome to Better Search
          </motion.h1>
          
          <motion.p
            className="login-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Sign in with your Google account to access enhanced search capabilities
          </motion.p>
          
          <motion.div 
            className="login-button"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div 
              className="signin-button-wrapper"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant='delete' 
                size="lg" 
                onClick={login}
                className="signin-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                </svg>
                Sign in with Google
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="login-features"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Smart product search</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Save search history</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Price comparisons</div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </motion.div>

      <style jsx="true">{`
        .login-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .login-subtitle {
          margin-bottom: 2rem;
          color: var(--neutral-600);
          font-size: 1.125rem;
          max-width: 35ch;
          text-align: center;
        }
        
        .signin-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          font-size: 1.125rem;
        }
        
        .login-features {
          margin-top: 3rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          text-align: left;
          width: 100%;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .feature-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: bold;
        }
        
        .feature-text {
          font-weight: 500;
          color: var(--neutral-700);
        }
        
        .profile-avatar {
          width: 100px;
          height: 100px;
          overflow: hidden;
          border-radius: 50%;
          margin-bottom: 1.5rem;
          border: 3px solid var(--primary-color);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.2);
        }
        
        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .profile-info {
          margin: 1.5rem 0;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .profile-field {
          display: flex;
          flex-direction: column;
          text-align: left;
          background: rgba(255, 255, 255, 0.5);
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .field-label {
          font-size: 0.875rem;
          color: var(--neutral-500);
          margin-bottom: 0.25rem;
        }
        
        .field-value {
          font-weight: 600;
          color: var(--neutral-800);
        }
      `}</style>
    </div>
  )
};

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<RobotStats />);

