import React, {useEffect, useState} from "react";
import './Data.css';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import Search from "react-searchbox-awesome";
import {
  AwesomeButton,
  AwesomeButtonProgress,
} from 'react-awesome-button';

import AwesomeButtonStyles from 'react-awesome-button/src/styles/themes/theme-c137/styles.module.scss';

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
  const enterHandler = e => {
    const input = e.target.value;
    setSearchitem(input);
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
            <Nav.Link href="/">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="data">
        <h1>Data Scraper Tool</h1>
        {/* <div className="square"> */}
        <div className="search">
         <Search 
          placeholder="What data do you want?" 
          style={search1}
          activeStyle={activeSearch}
          onInput={enterHandler}
         />
        </div>

        <div className="searchButton">
          <AwesomeButtonProgress 
          cssModule={AwesomeButtonStyles} 
          type="primary"
          size='large'
          onPress={(event, release) =>{
            
          }}>
            Search!
          </AwesomeButtonProgress>
        </div>
        {/* </div> */}
          <p>This is a tool that allows you to scrape data from the web. Using GPT-4o and Scraping Bee, it searches the web for what you want in the dataset and then uses the LLM to extract it fron the website.</p>
      </div>
    </div>
  )
};

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<RobotStats />);

