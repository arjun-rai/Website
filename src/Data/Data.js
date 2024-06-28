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
  TextField
} from '@material-ui/core';

export default function Data() {
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
    color:"white"
  };


  const search1={
    ...search,
    borderRadius:"15px",
    backgroundColor: "rgb(75,83,109)",
    borderColor:"rgb(44,48,64)"
    
    // backgroundImage: 
    // "linear-gradient(0deg, #b4ceb3 0%, #dbd3c9 37%, #fad4d8 100%)"
  };

  const activeSearch = {
    backgroundColor: "rgb(75,83,109)",
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
  return (
    <div className='main'>
      <Navbar expand='lg'>
        <Container>
          <Navbar.Brand href="/Data">Data Scraper</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/Data">Home</Nav.Link>
            <Nav.Link href="/Data/Datasets">Datasets</Nav.Link>
            <Nav.Link href="/Data/Login">{profile? ("Logout"): ("Login")}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="data">
        <h1>Data Scraper Tool</h1>
        {/* <div className="square"> */}
        {profile? (
          <div>
        <div className="search">
          <Search 
            placeholder="What data do you want?" 
            style={search1}
            activeStyle={activeSearch}
            onInput={inputHandler}
          />
          </div>
          <div className="input-num">
            <div className="result-text">Number of Results</div>
          <TextField 
              type="number"
              InputProps={{
                  inputProps: { 
                      max: 10, min: 1,
                      style: { fontSize: '1.5rem', height: '3rem', padding: '10px', color:'white'},
                      onChange: handleInputChange,
                  }
              }}
              label={''} // Conditionally render the label
              sx={{ width: '100%', fontSize: '1.5rem', color:'white'}} // Adjust the width and label font size
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
          <p>This is a tool that allows you to scrape data from the web. Using GPT-4o and Scraping Bee, it searches the web for what you want in the dataset and then uses the LLM to extract it fron the website.</p>
      </div>
    </div>
  )
};

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<RobotStats />);



