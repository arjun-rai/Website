import React, {useEffect, useState} from "react";
import './Data.css';
import { Navbar, Nav, Container, NavDropdown, Button, Modal } from 'react-bootstrap';
import Search from "react-searchbox-awesome";
import {
  AwesomeButton,
  AwesomeButtonProgress,
} from 'react-awesome-button';
import axios from 'axios';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import AwesomeButtonStyles from 'react-awesome-button/src/styles/themes/theme-c137/styles.module.scss';
import {
  TextField, makeStyles
} from '@material-ui/core';

import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  useEffect(() => {
    document.body.className= 'bodyData'
  }, []);
  
  const search = {
    width: "97%",
    color: "#333", // children inherit
    fontSize: "1.5rem", // children inherit
    border: "solid",
    overflow: "hidden",
    borderWidth: "thick",
    color:"black",
  };


  const search1={
    ...search,
    borderRadius:"15px",
    backgroundColor: "rgb(220, 220, 220)",
    borderColor:"rgb(220, 220, 220)",
    paddingLeft:'30px',

    
    // backgroundImage: 
    // "linear-gradient(0deg, #b4ceb3 0%, #dbd3c9 37%, #fad4d8 100%)"
  };

  const activeSearch = {
    backgroundColor: "rgb(220, 220, 220)12",
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
    if (!!numberInput && !!searchitem)
      {
        await axios.post(
          'https://t5frigw267.execute-api.us-east-1.amazonaws.com/default/dataScraper-dev-data-scraper?query=' + searchitem + '&num_result=' + numberInput + '&user=' + profile.email
        ).then(function (response)
        {
          // console.log(response);
          return response;
        });
      }
  }


  function until(conditionFunction) {
    const poll = async resolve => {
      if (await conditionFunction()) resolve();
      else setTimeout(_ => poll(resolve), 1000);
    };
  
    return new Promise(poll);
  }


  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
  async function waitOnFinish(rel) {
    var prevCount = await axios.get(
      'https://t5frigw267.execute-api.us-east-1.amazonaws.com/default/dataScraper-dev-data-scraper?userID=' + profile.email
    );
    prevCount = prevCount['data']['Count'];
    await until(() => isUpdated(prevCount));
    rel();
    handleShow();
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
  const [numberInput, setNumberInput] = useState(2);
  // State to track focus

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 20) e.target.value = 20;
    if (value < 2) e.target.value = 2;
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

  const [limit_, setLimit] = useState(false);


  useEffect(() => {
    // Fetch limit status on component mount or whenever profile.email changes
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://t5frigw267.execute-api.us-east-1.amazonaws.com/default/dataScraper-dev-data-scraper?userID=${profile.email}`
        );
        if (response.data.Items.length > 0) {
          const count = parseInt(response.data.Items[response.data.Items.length - 1].Count.N, 10);
          setLimit(count >=5);
        } else {
          setLimit(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLimit(false); // Handle error case
      }
    };

    fetchData(); // Fetch limit status when component mounts or profile.email changes
  }, [profile.email]);

  

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

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Search Completed!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Go to the History Tab to see the results!</Modal.Body>
        <Modal.Footer>
          <Button variant="delete" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="data">
        {/* <div className="square"> */}
        {profile? (
          <div>
        <div className="search">
          <img src='/search.svg'
          width="20"
          height="20"
          className="search-icon"
          />
          <Search 
            placeholder="What do you want to search?"
            style={search1}
            activeStyle={activeSearch}
            onInput={inputHandler}
          />
          </div>
          <div className="input-num">
            <div className="result-text">Number of Pages to Search</div>
          <TextField 
            id="standard-basic"
              type="number"
              InputProps={{
                  inputProps: { 
                      max: 20, min: 2, value:numberInput,
                      style: { fontSize: '1.5rem', height: '3rem', padding: '10px', color:'black', textAlign: 'center'},
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
          {limit_==1 ? 
          <div className="limit-text center"> 
            Out of Searches
          </div>: 
          <div className="searchButton">
            <AwesomeButtonProgress 
            cssModule={AwesomeButtonStyles} 
            type="primary"
            size='large'
            onPress={(event, release) => {
              if (!!numberInput && !!searchitem)
                {
                  handleSubmit();
                  waitOnFinish(release);
                }
                else
                {
                  release();
                }
              
            }}>
              Search!
            </AwesomeButtonProgress>
          </div>}
         
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



