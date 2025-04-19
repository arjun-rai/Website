import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button } from 'react-bootstrap';
import { motion } from 'framer-motion';

export default function SearchBox({ onSearch, onNumberChange, searchValue, numberValue, isScreenWide, limit, waitOnFinish, setDoneLoading }) {
  const [numberOfWebsites, setNumberOfWebsites] = React.useState(numberValue || 4);
  const [searchInput, setSearchInput] = React.useState(searchValue || '');
  const [loading, setLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('Searching...');

  const loadingMessages = ['Scraping Google Results', 'Loading Website', 'Analyzing Text', 'Generating Descriptions', 'Finding Images', 'Finding Prices'];

  React.useEffect(() => {
    let interval;
    if (loading) {
      let index = 0;
      interval = setInterval(() => {
        setLoadingText(loadingMessages[index]);
        index = (index + 1) % loadingMessages.length;
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleNumberChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value > 20) return;
    if (value < 4) return;
    setNumberOfWebsites(value);
    onNumberChange && onNumberChange(value);
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleSearchSubmit = async () => {
    if (searchInput.trim() && !limit) {
      setLoading(true);
      onSearch && onSearch(searchInput, numberOfWebsites);
      await waitOnFinish();
      setLoading(false);
      setDoneLoading(true);
    }
  };

  const incrementNumber = () => {
    if (numberOfWebsites < 20) {
      const newValue = numberOfWebsites + 1;
      setNumberOfWebsites(newValue);
      onNumberChange && onNumberChange(newValue);
    }
  };

  const decrementNumber = () => {
    if (numberOfWebsites > 4) {
      const newValue = numberOfWebsites - 1;
      setNumberOfWebsites(newValue);
      onNumberChange && onNumberChange(newValue);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Paper
        component="form"
        elevation={0}
        sx={{ 
          p: '2px 4px', 
          display: 'flex', 
          alignItems: 'center', 
          width: isScreenWide ? 800 : '100%', 
          borderRadius: '24px', 
          height: '80px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          }
        }}
      >
        <InputBase
          sx={{ 
            ml: 2, 
            flex: 1, 
            fontSize: '1.25rem', 
            fontWeight: 500,
            color: '#1f2937',
            '&::placeholder': {
              color: '#9ca3af',
              opacity: 1,
              fontWeight: 400,
            }
          }}
          placeholder="What do you want to search?"
          inputProps={{ 'aria-label': 'search better search' }}
          value={searchInput}
          onChange={handleSearchChange}
        />
        <Divider sx={{ height: 40, m: 0.5, backgroundColor: 'rgba(0, 0, 0, 0.05)' }} orientation="vertical" />
        
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
          <motion.div whileTap={{ scale: 0.95 }}>
            <IconButton 
              onClick={decrementNumber} 
              color="primary"
              sx={{ 
                color: 'var(--primary-color)', 
                borderRadius: '12px', 
                height: '36px', 
                width: '36px',
                backgroundColor: 'rgba(198, 202, 83, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(198, 202, 83, 0.1)',
                }
              }}
            >
              <RemoveIcon />
            </IconButton>
          </motion.div>
          
          <div style={{ 
            margin: '0 12px', 
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#4b5563',
            minWidth: '60px',
            textAlign: 'center' 
          }}>
            {numberOfWebsites} pages
          </div>
          
          <motion.div whileTap={{ scale: 0.95 }}>
            <IconButton 
              onClick={incrementNumber} 
              color="primary"
              sx={{ 
                color: 'var(--primary-color)', 
                borderRadius: '12px', 
                height: '36px', 
                width: '36px',
                backgroundColor: 'rgba(198, 202, 83, 0.05)',
                '&:hover': {
                  backgroundColor: 'rgba(198, 202, 83, 0.1)',
                }
              }}
            >
              <AddIcon />
            </IconButton>
          </motion.div>
        </div>
        
        <motion.div
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.02 }}
        >
          <Button 
            variant="delete" 
            size="lg"
            onClick={handleSearchSubmit}
            disabled={limit || loading}
            className={loading ? "search-btn-loading" : "search-btn"}
            style={{
              marginLeft: '8px',
              marginRight: '16px',
              borderRadius: '16px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'white',
              background: loading 
                ? `linear-gradient(135deg, var(--primary-color), var(--secondary-color))` 
                : `linear-gradient(135deg, var(--primary-color), var(--secondary-color))`,
              border: 'none',
              boxShadow: '0 4px 12px rgba(198, 202, 83, 0.2)',
              minWidth: '120px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {loading ? (
              <>
                <span className="dot-elastic"></span>
                {loadingText}
              </>
            ) : (
              <>
                <SearchIcon style={{ fontSize: '1.25rem' }} />
                Search
              </>
            )}
          </Button>
        </motion.div>
      </Paper>
      
      <style jsx="true">{`
        .search-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          transition: 0.5s;
        }
        
        .search-btn:hover::after {
          left: 100%;
        }
        
        .dot-elastic {
          position: relative;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: white;
          margin-right: 12px;
        }
        
        .dot-elastic::before,
        .dot-elastic::after {
          content: '';
          display: inline-block;
          position: absolute;
          top: 0;
        }
        
        .dot-elastic::before {
          left: -12px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: white;
          animation: dot-elastic-before 1s infinite ease-in-out;
        }
        
        .dot-elastic::after {
          left: 12px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: white;
          animation: dot-elastic-after 1s infinite ease-in-out;
        }
        
        @keyframes dot-elastic-before {
          0% { transform: scale(1); }
          25% { transform: scale(1.5); }
          50% { transform: scale(1); }
          75% { transform: scale(1); }
          100% { transform: scale(1); }
        }
        
        @keyframes dot-elastic-after {
          0% { transform: scale(1); }
          25% { transform: scale(1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
      `}</style>
    </motion.div>
  );
}