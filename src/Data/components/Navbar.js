import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { googleLogout } from '@react-oauth/google';

export default function CustomNavbar({ login, profile, setProfile }) {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [applyClass, setApplyClass] = useState(true);
  const [isScreenWide, setIsScreenWide] = useState(window.innerWidth > 768);

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

  const logOut = () => {
    googleLogout();
    setProfile(null);
    localStorage.setItem('profile', null);
    localStorage.setItem('user', null);
  };

  useEffect(() => {
    const handleResize = () => {
      const newIsScreenWide = window.innerWidth > 768;
      
      if (newIsScreenWide && !isScreenWide) {
        setIsNavExpanded(false);
        setApplyClass(true);
        
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

  return (
    <>
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

      <style jsx="true">{`
        .custom-navbar {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 0.25rem 0;
          margin: 0;
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0;
        }

        .container {
          padding: 0 0.5rem;
          margin: 0;
          max-width: 100%;
        }

        .brand-logo {
          width: 30px;
          height: 30px;
        }

        .logo-text {
          font-weight: 600;
          color: var(--neutral-800);
        }

        .custom-toggler {
          border: none;
          padding: 0.25rem;
          margin: 0;
        }

        .nav-links {
          width: 100%;
          padding: 0.5rem 0;
        }

        .nav-items {
          display: flex;
          gap: 1rem;
        }

        .mobile-auth {
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }

        .desktop-auth {
          margin-left: 1rem;
          margin-right: 0;
          padding-right: 0;
        }

        @media (min-width: 769px) {
          .nav-links {
            justify-content: center;
          }

          .nav-items {
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .custom-navbar {
            padding: 0.25rem 0.5rem;
          }

          .container {
            padding: 0;
          }

          .desktop-auth {
            margin-right: 0.5rem;
          }

          .navbar-collapse {
            background: rgba(255, 255, 255, 0.95);
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            z-index: 1000;
            padding: 0.5rem 1rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            max-height: 0;
            transition: max-height 0.3s ease-out;
            overflow: hidden;
          }

          .navbar-collapse.show {
            max-height: 200px;
          }

          .nav-items {
            flex-direction: column;
            gap: 0.5rem;
          }

          .nav-link {
            padding: 0.5rem 0;
          }
        }
      `}</style>
    </>
  );
} 