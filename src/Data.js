import React, {useEffect, useState} from "react";
import './Data.css';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import Search from "react-searchbox-awesome";

export default function Data() {
  useEffect(() => {
    document.body.className= 'bodyData'
  }, []);
  
  const search = {
    width: "97%",
    color: "#333", // children inherit
    fontSize: "2.5rem", // children inherit
    border: "none",
    overflow: "hidden"
  }

  const search1={
    ...search,
    borderRadius:"15px",
    backgroundColor: "#b4ceb3"
  }

  const activeSearch = {
    backgroundColor: "#b4ceb3"
  }



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
         />
        </div>
        {/* </div> */}
          <p>This is a tool that allows you to scrape data from the web. Using GPT-4o and Scraping Bee, it searches the web for what you want in the dataset and then uses the LLM to extract it fron the website.</p>
      </div>
    </div>
  )
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<RobotStats />);

