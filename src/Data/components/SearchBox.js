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
    <Paper
      component="form"
      sx={{ 
        p: '2px 4px', 
        display: 'flex', 
        alignItems: 'center', 
        width: isScreenWide ? 800 : '100%', 
        borderRadius: '15px', 
        height: '75px',
        backgroundColor: 'rgb(220, 220, 220)',
        border: 'none'
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1, fontSize: '1.25rem', color: 'black' }}
        placeholder="What do you want to search?"
        inputProps={{ 'aria-label': 'search better search' }}
        value={searchInput}
        onChange={handleSearchChange}
      />
      <Divider sx={{ height: 60, m: 0.5 }} orientation="vertical" />
      <TextField
        sx={{ 
          width: 150, 
          color: 'black',
          '& .MuiInputBase-root': {
            border: 'none',
            '&:before': {
              borderBottom: 'none',
            },
            '&:after': {
              borderBottom: 'none',
            },
            '&:hover:not(.Mui-disabled):before': {
              borderBottom: 'none',
            },
            fontSize: '1.25rem',
          },
        }}
        id="outlined-number"
        type="text"
        value={`Scan ${numberOfWebsites} pages`}
        onChange={handleNumberChange}
        variant="standard"
        inputProps={{
          min: 4,
          max: 20,
          style: { textAlign: 'center' }
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <IconButton onClick={incrementNumber} sx={{ color: 'black', borderRadius: '50%', mb: 1, height: '10px', width: '10px', ml: 1, mr: 0.5}}>
          <AddIcon />
        </IconButton>
        <IconButton onClick={decrementNumber} sx={{ color: 'black', borderRadius: '50%', height: '10px', width: '10px', ml: 1, mr: 0.5 }}>
          <RemoveIcon />
        </IconButton>
      </div>
      <Divider sx={{ height: 60, m: 0.5 }} orientation="vertical" />
      <Button 
        variant="delete" 
        size="lg"
        onClick={handleSearchSubmit}
        disabled={limit || loading}
        style={{
          marginLeft: '10px',
          marginRight: '10px',
          borderRadius: '15px',
          padding: '10px 20px',
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'black'
        }}
      >
        {loading ? loadingText : 'Search'}
      </Button>
    </Paper>
  );
}