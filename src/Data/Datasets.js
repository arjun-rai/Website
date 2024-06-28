import React, {useEffect, useState} from "react";
import './Data.css';
import { Navbar, Nav, Container, NavDropdown, ListGroup, Badge, Card, Accordion} from 'react-bootstrap';
import {
  AwesomeButton,
  AwesomeButtonProgress,
} from 'react-awesome-button';

import AwesomeButtonStyles from 'react-awesome-button/src/styles/themes/theme-c137/styles.module.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

export default function Datasets() {
  useEffect(() => {
    document.body.className= 'bodyData'
  },[]);

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [profile, setProfile] = useState(() => {
    const storedProfile = localStorage.getItem('profile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  });

  const [dataList, setDataList] = useState([]);
  async function loadData() {
    try {
      const response = await axios.get(
        'https://t5frigw267.execute-api.us-east-1.amazonaws.com/default/dataScraper-dev-data-scraper?userID=' + profile.email
      );
      const data = response.data;
  
      if (!data || !data.Items) {
        throw new Error("Unexpected response structure");
      }
  
      var dataList = [];
      for (let i = 0; i < data.Items.length; i++) {
        var keyVal = data.Items[i].title;
        var value = [];
        const itemData = JSON.parse(data.Items[i].data.S);
        const length = itemData.length;
        for (let j = 0; j < length; j++) {
          value.push(itemData[j]['0'][Object.keys(itemData[j]['0'])[0]]);
        }
        dataList.push({
          key:   keyVal,
          value: value
      });
      }
      setDataList(dataList.map((item, idx) => dataList[dataList.length - 1 - idx]));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

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
      <div className="datasets">
      {profile ? (
                <div>
                <Accordion defaultActiveKey="0">
                  {dataList.map((item, index) => (
                    <Accordion.Item eventKey={index.toString()}>
                      <Accordion.Header className='acc'>{item.key['S']} <Badge bg="primary" pill> {item.value.length} </Badge></Accordion.Header>
                      <Accordion.Body>
                        <ListGroup>
                          {item.value.map((val, idx) => (
                            <ListGroup.Item variant='dark' className='listText' key={idx}>{val}</ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
                </div>
            ) : (
              <div>
              <h1>No User Logged In</h1>
              </div>
            )}
      </div>
    </div>
  )
};

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<RobotStats />);

