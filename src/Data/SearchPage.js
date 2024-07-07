import React, {useEffect, useState} from "react";
import './Data.css';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import Search from "react-searchbox-awesome";
import {
  AwesomeButton,
  AwesomeButtonProgress,
} from 'react-awesome-button';
import axios from "axios";
import AwesomeButtonStyles from 'react-awesome-button/src/styles/themes/theme-c137/styles.module.scss';
import {
  TextField, makeStyles
} from '@material-ui/core';

export default function SearchPage() {
  useEffect(() => {
    document.body.className= 'bodyData'
  }, []);
  
  const search = {
    width: "97%",
    color: "#333", // children inherit
    fontSize: "2.5rem", // children inherit
    border: "solid",
    overflow: "hidden",
    borderWidth: "thick",
    color:"black"
  };


  const search1={
    ...search,
    borderRadius:"15px",
    backgroundColor: "#5F6062",
    borderColor:"#5F6062"
    
    // backgroundImage: 
    // "linear-gradient(0deg, #b4ceb3 0%, #dbd3c9 37%, #fad4d8 100%)"
  };

  const activeSearch = {
    backgroundColor: "#5F6062",
  };

  const [searchitem, setSearchitem] = useState("");
  const inputHandler = e => {
    const input = e.target.value;
    setSearchitem(input);
  };

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

  async function handleSubmit(){
    await axios.post(
      'https://t5frigw267.execute-api.us-east-1.amazonaws.com/default/dataScraper-dev-data-scraper?query=' + searchitem + '&num_result=' + numberInput + '&user=' + profile.email
    ).then(function (response)
    {
      console.log(response);
      return response;
    });
  }


  function until(conditionFunction) {
    const poll = async resolve => {
      if (await conditionFunction()) resolve();
      else setTimeout(_ => poll(resolve), 1000);
    };
  
    return new Promise(poll);
  }
  
  async function waitOnFinish(rel) {
    var prevCount = await axios.get(
      'https://t5frigw267.execute-api.us-east-1.amazonaws.com/default/dataScraper-dev-data-scraper?userID=' + profile.email
    );
    prevCount = prevCount['data']['Count'];
    await until(() => isUpdated(prevCount));
    rel();
    console.log('FINISH');
  }
  
  async function isUpdated(oldCount) {
    var count = await axios.get(
      'https://t5frigw267.execute-api.us-east-1.amazonaws.com/default/dataScraper-dev-data-scraper?userID=' + profile.email
    );
    count = count['data']['Count'];
    if (count > oldCount) {
      return true;
    } else {
      return false;
    }
  }

  // State to hold the input value
  const [numberInput, setNumberInput] = useState('');
  // State to track focus

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 10) e.target.value = 10;
    if (value < 1) e.target.value = 1;
    setNumberInput(e.target.value); // Update state
  };

  const useStyles = makeStyles({
    underline: {
      '&:before': {
        borderBottomColor: 'black', // Color of the underline before the input is focused
      },
      '&:after': {
        borderBottomColor: 'black', // Color of the underline when the input is focused
      },
    },
  });

  const classes = useStyles();

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
            <Nav.Link href="/Data/Login">{profile? ("Logout"): ("Login")}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="data">
        {/* <div className="square"> */}
        {profile? (
          <div>
        <div className="search">
          <Search 
            placeholder="What do you want to search?" 
            style={search1}
            activeStyle={activeSearch}
            onInput={inputHandler}
          />
          </div>
          <div className="input-num">
            <div className="result-text">Number of Results</div>
          <TextField 
            id="standard-basic"
              type="number"
              InputProps={{
                  inputProps: { 
                      max: 10, min: 1,
                      style: { fontSize: '1.5rem', height: '3rem', padding: '10px', color:'black'},
                      onChange: handleInputChange,
                  },
                  classes: {
                    underline: classes.underline,
                  },
              }}
              label={''} // Conditionally render the label
              sx={{ width: '100%', fontSize: '1.5rem', color:'black'}} // Adjust the width and label font size
          />
          </div>

          <div className="searchButton">
            <AwesomeButtonProgress 
            cssModule={AwesomeButtonStyles} 
            type="primary"
            size='large'
            visible={!!numberInput && !!searchitem}
            onPress={(event, release) => {
              handleSubmit();
              waitOnFinish(release);
            }}>
              Search!
            </AwesomeButtonProgress>
          </div>
        </div>
        ):(
          <h1>
            Login!
          </h1>
        )
        }
        {/* </div> */}
      </div>
    </div>
  )
};

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<RobotStats />);



