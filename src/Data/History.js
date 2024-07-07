import React, {useEffect, useState} from "react";
import './Data.css';
import { Navbar, Nav, Container, NavDropdown, ListGroup, Badge, Card, Accordion, Button} from 'react-bootstrap';

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
  const [timeStamps, setTimeStamps] = useState([]);
  const [desc, setDesc] = useState([]);
  const [price, setPrice] = useState([]);

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
      var timeStamps = [];
      var prices = [];
      for (let i = 0; i < data.Items.length; i++) {
        var keyVal = data.Items[i].title;
        var value = [];
        var descList = [];
        var priceList = [];
        const itemData = JSON.parse(data.Items[i].data.S);
        const length = itemData.length;
        // console.log(itemData[0]);
        for (let j = 0; j < length; j++) {
          value.push(itemData[j][Object.keys(itemData[j])[0]]);
          descList.push(itemData[j][Object.keys(itemData[j])[2]])
          try {
            priceList.push(itemData[j][Object.keys(itemData[j])[3]]);
          } catch(error){
            priceList.push('N/A');
          }

        }
        dataList.push({
          key:   keyVal,
          value: value
      });
      timeStamps.push(data.Items[i]['timestamp']['S']);
      desc.push(descList);
      price.push(priceList);
      }
      setDataList(dataList.map((item, idx) => dataList[dataList.length - 1 - idx]));
      setTimeStamps(timeStamps.map((item, idx) => timeStamps[timeStamps.length - 1 - idx]));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async function deleteItem(timestamp_del)
  {
    // console.log(timestamp_del);
    await axios.delete(
      'https://t5frigw267.execute-api.us-east-1.amazonaws.com/default/dataScraper-dev-data-scraper?userID=' + profile.email + '&timestamp=' + timestamp_del
    );
    loadData();
  }

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

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
      <div className="datasets">
      {profile ? (
                <div>
                <Accordion defaultActiveKey="0">
                  {dataList.map((item, index) => (
                    <Accordion.Item eventKey={index.toString()}>
                      <Accordion.Header>
                        <div className="header-content">
                          <span>{item.key['S']}</span>
                          <div className="align-right">
                            <Badge pill>{item.value.length}</Badge>
                            <Button variant='delete' size="sm" className="buttonDelete" onClick={()=>deleteItem(timeStamps[index])}>Delete</Button>
                          </div>
                        </div>
                      </Accordion.Header>
                      <Accordion.Body>
                        <ListGroup>
                          {item.value.map((val, idx) => (
                            <ListGroup.Item variant='light' className='listText' key={idx}> <span className="item-title-and-cost">{val} - {price[price.length - 1 - index][idx]} </span><br/> {desc[desc.length - 1 - index][idx]}</ListGroup.Item>
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

