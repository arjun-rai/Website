import React, {useEffect, useState} from "react";
import './Data.css';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import CustomNavbar from './components/Navbar';
import { Button, Badge } from 'react-bootstrap';

export default function Home() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [profile, setProfile] = useState(() => {
    const storedProfile = localStorage.getItem('profile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    document.body.className= 'bodyData';
    
    // Set favicon and title
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = '/logo.ico';
    document.title = 'Better Search - Find Products Faster';
  }, []);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
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
  }, [user]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: custom * 0.2,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const exampleItems = [
    {
      name: "Nvidia GeForce RTX 5070 - $600",
      description: "Offers great performance for the price tier with faster rendering and DLSS support. 20% faster than RTX 4070 at the same price.",
      image: "/rtx5070.jpg",
      sources: ["www.tomshardware.com", "www.ign.com", "www.rockpapershotgun.com", "www.pcmag.com", "www.pcgamer.com"]
    },
    {
      name: "AMD Radeon RX 9070 - $669",
      description: "Comparable to RTX 5070 but with a slightly higher real-world price and better AI and ray tracing performance.",
      image: "/rx9070.avif",
      sources: ["www.tomshardware.com", "www.pcmag.com", "www.pcgamer.com"]
    },
    {
      name: "Intel Arc B580 - $341",
      description: "Affordable option with a good balance of performance and features, competes well in the mid-range market.",
      image: "/arcb580.jpg",
      sources: ["www.tomshardware.com", "www.rockpapershotgun.com", "www.pcmag.com"]
    },
    {
      name: "Nvidia RTX 4070 Super - $650",
      description: "The best for ultrawide gaming monitors, it offers significant performance improvements without price increase. Stronger in ray tracing and DLSS upscaling than competitors.",
      image: "/rtx4070super.jpg",
      sources: ["www.rockpapershotgun.com", "www.pcgamer.com"]
    }
  ];

  return (
    <div className='main home-page'>
       <CustomNavbar login={login} profile={profile} setProfile={setProfile} />


      <motion.div 
        className="hero-section"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div 
          className="hero-content"
          variants={fadeInUp}
          custom={0}
        >
          <motion.h1 
            className="hero-title"
            variants={fadeInUp}
            custom={1}
          >
            <div className="title-container">
              Find the perfect product <span className="gradient-text">faster</span>
            </div>
          </motion.h1>
          
          <div className="subtitle-grid-container">
            <motion.div 
              className="hero-subtitle"
              variants={fadeInUp}
              custom={2}
            >
              Quickly find the best products of any kind with GPT enhanced product search
            </motion.div>
          </div>
          
          <motion.div
            variants={fadeInUp}
            custom={3}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="button-container"
          >
            <Button 
              variant='delete' 
              size="lg" 
              className="get-started-button" 
              onClick={() => profile ? navigate('/Data/Search') : login()}
            >
              Get started
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="example-section"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={4}
      >
        <div className="example-card">
          <div className="search-header">
            <div className="search-query">
              <span className="query-text">best gaming gpu</span>
              <div className="button-group">
                <button className="delete-button">Delete</button>
                <button className="expand-button">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="example-results">
            {exampleItems.map((item, index) => (
              <motion.div 
                className="result-item" 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
              >
                <div className="result-image">
                  <img src={item.image || `/product_placeholder.png`} alt={item.name} />
                </div>
                <div className="result-content">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="sources-container">
                    <Badge pill className="source-count">{item.sources.length}</Badge>
                    <div className="source-buttons">
                      {item.sources.map((source, idx) => (
                        <motion.div 
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="source-button-container"
                        >
                          <Button 
                            variant='delete' 
                            size="sm" 
                            className='source-button' 
                            onClick={() => window.open(`https://${source}`, '_blank')}
                          >
                            {source}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="features-section"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        custom={5}
      >
        <h2 className="section-title">Better Search does the work for you</h2>
        <p className="section-subtitle">Search up to 20 sites at once and create a product list including cost, description, and the sites that reference the product.</p>
        
        <div className="features-grid">
          <motion.div 
            className="feature-card"
            whileHover={{ y: -5 }}
          >
            <div className="feature-icon">🔍</div>
            <h3>Multi-site Search</h3>
            <p>Search across 20 websites at once to find the best products</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            whileHover={{ y: -5 }}
          >
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered</h3>
            <p>GPT technology analyzes and summarizes product information</p>
          </motion.div>
          
          <motion.div 
            className="feature-card"
            whileHover={{ y: -5 }}
          >
            <div className="feature-icon">💰</div>
            <h3>Price Comparison</h3>
            <p>Compare prices across multiple retailers in one view</p>
          </motion.div>
        </div>
      </motion.div>

      {/* <footer className="site-footer">
        <p>© 2023 Better Search. All rights reserved.</p>
      </footer> */}

      <style jsx="true">{`
        .home-page {
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }
        
        .main {
          margin: 0;
          padding: 0;
        }
        
        .hero-section {
          padding: 3rem 1rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 0 1rem;
          text-align: center;
        }
        
        .hero-title {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          text-align: center;
          width: 100%;
        }
        
        .title-container {
          display: inline-block;
          text-align: center;
          margin: 0 auto;
          width: 100%;
          word-spacing: 0.1em;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-left: 0.15em;
          display: inline-block;
        }
        
        .subtitle-grid-container {
          display: grid;
          place-items: center;
          width: 100%;
          margin-bottom: 2.5rem;
        }
        
        .hero-subtitle {
          font-size: clamp(1.25rem, 3vw, 1.5rem);
          color: var(--neutral-600);
          width: 100%;
          max-width: 650px;
          text-align: center;
          line-height: 1.5;
          padding: 0 1rem;
        }
        
        .button-container {
          display: flex;
          justify-content: center;
          margin: 0 auto;
        }
        
        .get-started-button {
          padding: 0.8rem 2.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: var(--border-radius-md);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
        }
        
        .example-section {
          padding: 3rem 1rem 5rem;
          max-width: 1000px;
          margin: 0 auto;
          text-align: center;
        }
        
        .example-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-lg);
          border: 1px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }
        
        .search-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .search-query {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem;
        }
        
        .query-text {
          font-weight: 500;
          font-size: 1rem;
          color: var(--neutral-800);
        }
        
        .button-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .delete-button {
          background-color: transparent;
          color: #FF4136;
          border: none;
          padding: 0.25rem 0.75rem;
          border-radius: var(--border-radius-sm);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
        }
        
        .delete-button:hover {
          background-color: rgba(255, 65, 54, 0.1);
        }

        .expand-button {
          background: transparent;
          border: none;
          padding: 0.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--neutral-500);
          transition: var(--transition);
        }

        .expand-button:hover {
          color: var(--neutral-700);
        }
        
        .example-results {
          padding: 1.5rem;
        }
        
        .result-item {
          display: flex;
          gap: 1.5rem;
          padding: 1.5rem;
          margin-bottom: 1rem;
          background: rgba(255, 255, 255, 0.5);
          border-radius: var(--border-radius-md);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: var(--transition);
          text-align: left;
        }
        
        .result-item:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        
        .result-image {
          flex-shrink: 0;
          width: 120px;
          height: 120px;
          border-radius: var(--border-radius-sm);
          overflow: hidden;
          background-color: white;
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 0.5rem;
        }
        
        .result-image img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        
        .result-content {
          flex: 1;
        }
        
        .result-content h3 {
          margin: 0 0 0.5rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--neutral-800);
        }
        
        .result-content p {
          margin: 0.5rem 0 1rem;
          font-size: 0.95rem;
          color: var(--neutral-600);
          line-height: 1.6;
        }
        
        .sources-container {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
        }
        
        .source-count {
          background-color: var(--primary-color) !important;
          color: white !important;
          font-size: 0.85rem !important;
          font-weight: 600 !important;
          padding: 0.5rem 0.75rem !important;
          position: absolute !important;
          left: 0;
          z-index: 1;
        }
        
        .source-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-left: 4rem;
          width: calc(100% - 4rem);
        }
        
        .source-button-container {
          display: inline-block;
        }
        
        .source-button {
          font-size: 0.8rem;
          padding: 0.4rem 0.75rem;
          font-weight: 600;
          opacity: 0.9;
          background-color: var(--accent-color);
          color: white;
          border: none;
        }
        
        .source-button:hover {
          opacity: 1;
          background-color: var(--primary-color);
        }
        
        .features-section {
          padding: 5rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }
        
        .section-title {
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          margin-bottom: 1rem;
          color: var(--neutral-800);
          text-align: center;
        }
        
        .section-subtitle {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: var(--neutral-600);
          max-width: 700px;
          margin: 0 auto 3rem;
          text-align: center;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .feature-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: var(--border-radius-md);
          padding: 2rem;
          text-align: center;
          box-shadow: var(--shadow-md);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: var(--transition);
        }
        
        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        
        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--neutral-800);
        }
        
        .feature-card p {
          font-size: 1rem;
          color: var(--neutral-600);
          margin: 0;
        }
        
        .site-footer {
          text-align: center;
          padding: 2rem;
          color: var(--neutral-500);
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .custom-navbar {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          padding: 0.5rem 0;
        }

        .brand-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
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
          margin-right: 0;
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
            padding: 0.5rem 1rem;
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

          .result-item {
            flex-direction: column;
          }
          
          .result-image {
            width: 100%;
            height: 200px;
            margin: 0 auto;
          }
          
          .result-content h3 {
            text-align: center;
          }
          
          .result-content p {
            text-align: center;
          }
          
          .sources-container {
            flex-direction: column;
            align-items: center;
          }
          
          .source-buttons {
            justify-content: center;
            margin-left: 0;
            margin-top: 3rem;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}


