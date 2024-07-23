import React, {useEffect, useState} from "react";
import './Data.css';
import { Navbar, Nav, Container, NavDropdown, Button, Modal, ListGroup, Badge} from 'react-bootstrap';
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

  const search2={
    ...search,
    borderRadius:"15px",
    backgroundColor: "rgb(220, 220, 220)",
    borderColor:"rgb(220, 220, 220)",
    paddingLeft:'30px',
    fontSize: "1rem",

    
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
    loadData();
    await until(() => isUpdated(dataList));
    // console.log(dataList);

    rel();
    handleShow();
    // console.log('FINISH');
    setDoneLoading(true);
    setLoadingNum(0);
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
  const [numberInput, setNumberInput] = useState(4);
  // State to track focus

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value > 20) e.target.value = 20;
    if (value < 4) e.target.value = 4;
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
    document.title = 'Better Search'; // Change website title
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
  }, [profile]);

  const [loadingNum, setLoadingNum] = useState(0);
  const loadingList = ['', 'Scraping Google Results', 'Loading Website', 'Analyzing Text', 'Generating Descriptions', 'Finding Images', 'Finding Prices', 
  'Loading Website', 'Analyzing Text', 'Generating Descriptions', 'Finding Images', 'Finding Prices', 
  'Loading Website', 'Analyzing Text', 'Generating Descriptions', 'Finding Images', 'Finding Prices'];

  useEffect(() => {
    let interval;
    if (loadingNum > 0 && loadingNum < loadingList.length) {
      interval = setInterval(() => {
        setLoadingNum(prevLoadingNum => (prevLoadingNum + 1) % loadingList.length);
      }, 4000); // Change label every 1 second
    }
    return () => clearInterval(interval);
  }, [loadingNum]);



  const loading = () => {
    return loadingList[loadingNum];
  };
  
  const [dataList, setDataList] = useState([]);
  const [timeStamps, setTimeStamps] = useState([]);
  const [desc, setDesc] = useState([]);
  const [price, setPrice] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [sources, setSources] = useState([]);
  const [domains, setDomains] = useState([]);
  const [counter, setCounter] = useState([]);

  const [doneLoading, setDoneLoading] = useState(false);

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
      for (let i = 0; i < data.Items.length; i++) {
        var keyVal = data.Items[i].title;
        var value = [];
        var descList = [];
        var priceList = [];
        const itemData = JSON.parse(data.Items[i].data.S);
        // console.log(data.Items[i].visible.BOOL);
        if (data.Items[i].visible.BOOL==false)
          {
            continue;
          }
        const length = itemData.length;
        // console.log(data.Items[i].image_urls.S);
        imgs.push(JSON.parse(data.Items[i].image_urls.S));
        var tempSources = (JSON.parse(data.Items[i].source_urls.S));
        var sourcesSep = [];
        var counterTemp = [];
        var tempDomains = []
        for (let j = 0; j < length; j++) {
          sourcesSep.push(tempSources[itemData[j][Object.keys(itemData[j])[0]].toLowerCase()]);
          counterTemp.push(tempSources[itemData[j][Object.keys(itemData[j])[0]].toLowerCase()].length);
          
          var temp2Domains = []
          for (let l=0;l<tempSources[itemData[j][Object.keys(itemData[j])[0]].toLowerCase()].length;l++)
          {
            var tempUrl= new URL(tempSources[itemData[j][Object.keys(itemData[j])[0]].toLowerCase()][l]);  
            var domain = tempUrl.hostname.slice(0, tempUrl.hostname.length);
            temp2Domains.push(domain);
          }
          tempDomains.push(temp2Domains);
         


          value.push(itemData[j][Object.keys(itemData[j])[0]]);
          descList.push(itemData[j][Object.keys(itemData[j])[2]])
          try {
            priceList.push(itemData[j][Object.keys(itemData[j])[3]]);
          } catch(error){
            priceList.push('N/A');
          }

        }
        sources.push(sourcesSep);
        domains.push(tempDomains);
        counter.push(counterTemp);
        // console.log(sources);
        // console.log(counter)
        dataList.push({
          key:   keyVal,
          value: value
      });
      timeStamps.push(data.Items[i]['timestamp']['S']);
      desc.push(descList);
      price.push(priceList);
      }
      

      let tempCounter=[];
      let tempDatalistMain=dataList;
      let tempImgs = [];
      tempSources =[];
      tempDomains=[];
      let tempDesc = [];
      let tempPrice =[];  

      for (let k=0;k<counter.length;k++)
        {
          let indexedList = counter[k].map((value, index) => ({ value, index }));
          indexedList.sort((a, b) => b.value - a.value);
          let sortedIndexes = indexedList.map(pair => pair.index);

          let sortedCounter = indexedList.map(pair => pair.value);
          let sortedDataList = sortedIndexes.map(index => dataList[k]['value'][index]);
          let sortedImgs = sortedIndexes.map(index => imgs[k][index]);
          let sortedSources = sortedIndexes.map(index => sources[k][index]);
          let sortedDomains = sortedIndexes.map(index => domains[k][index]);
          let sortedDesc = sortedIndexes.map(index => desc[k][index]);
          let sortedPrice = sortedIndexes.map(index => price[k][index]);
          tempDatalistMain[k].value=sortedDataList;
          tempCounter.push(sortedCounter);
          tempImgs.push(sortedImgs);
          tempSources.push(sortedSources);
          tempDomains.push(sortedDomains);
          tempDesc.unshift(sortedDesc);
          tempPrice.push(sortedPrice);
          // console.log(sortedDataList);
        }
        // setCounter(tempCounter);
        // setDataList(tempDatalistMain);
        // setImgs(tempImgs);
        // setSources(tempSources);
        // setDomains(tempDomains);
        // setDesc(tempDesc);
        setPrice(tempPrice);

        setDataList(tempDatalistMain.map((item, idx) => tempDatalistMain[tempDatalistMain.length - 1 - idx]));
        setTimeStamps(timeStamps.map((item, idx) => timeStamps[timeStamps.length - 1 - idx]));
        setImgs(tempImgs.map((item, idx) => tempImgs[tempImgs.length - 1 - idx]));
        setSources(tempSources.map((item, idx) => tempSources[tempSources.length - 1 - idx]));
        setDomains(tempDomains.map((item, idx) => tempDomains[tempDomains.length - 1 - idx]));
        setDesc(tempDesc.map((item, idx) => tempDesc[tempDesc.length - 1 - idx]));
        // setPrice(counter.map((item, idx) => price[price.length - 1 - idx]));
        setCounter(tempCounter.map((item, idx) => tempCounter[tempCounter.length - 1 - idx]));
        


    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  const [isScreenWide, setIsScreenWide] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      setIsScreenWide(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className='main'>
      <Navbar expand={isScreenWide} onToggle={handleToggle} expanded={isNavExpanded}>
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
          <Navbar.Toggle aria-controls="basic-navbar-nav" className={applyClass ? "nav-bar-right": ''}/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className={applyClass ? "nav-bar-center" : ""}>
              <Nav.Link href="/Data/Search">Search</Nav.Link>
              <Nav.Link href="/Data/History">History</Nav.Link>
              {isScreenWide ? null : (
              <Nav className="ml-auto">
                {profile ? (
                  <Nav.Link onClick={logOut}>Logout</Nav.Link>
                  // <Button variant='delete' size="sm" onClick={logOut}>Logout</Button>
                ) : (
                  <Nav.Link onClick={login}>Login</Nav.Link>
                )}
              </Nav>
          )}
            </Nav>
          </Navbar.Collapse>
          {!isScreenWide ? null : (
            <Nav className="ml-auto">
              {profile ? (
                <Button variant='delete' size="sm" onClick={logOut}>Logout</Button>
              ) : (
                <Button variant='delete' size="sm" onClick={login}>Sign In!</Button>
              )}
            </Nav>
          )}
         
        </Container>
      </Navbar>

      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Search Completed!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Go to the History Tab to see the results!</Modal.Body>
        <Modal.Footer>
          <Button variant="delete" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal> */}

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
            style={!isScreenWide ? search2:search1}
            activeStyle={activeSearch}
            onInput={inputHandler}
          />
          </div>
          <div className="input-num">
            <div className="result-text">Number of Websites to Scan</div>
          <TextField 
            id="standard-basic"
              type="number"
              InputProps={{
                  inputProps: { 
                      max: 20, min: 4, value:numberInput,
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
            loadingLabel={loading()}
            onPress={(event, release) => {
              if (!!numberInput && !!searchitem)
                {
                  setLoadingNum(1);
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
          <div className="datasets bottom-margin">
            {doneLoading? <ListGroup>
                          {
                          dataList[0].value.map((val, idx) => (
                            <ListGroup.Item variant='light' className='listText' key={idx}> 
                              {isScreenWide?
                            <div className="img-with-item">
                            <img
                              alt=''
                              src={imgs[0][idx]}
                              className="prod-img"
                            />
                            <div>
                              <span className="item-title-and-cost">{val} - {price[price.length - 1 - 0][idx]} 
                              </span>
                              <br/> 
                              {desc[desc.length - 1 - 0][idx]}
                            </div>
                          </div>
                          :
                          <div>
                              <div className="img-with-item">
                                <img
                                  alt=''
                                  src={imgs[0][idx]}
                                  className="prod-img"
                                />
                                </div>
                                <div>
                                  <span className="item-title-and-cost">{val} - {price[price.length - 1 - 0][idx]} 
                                  </span>
                                  <br/> 
                                  {desc[desc.length - 1 - 0][idx]}
                                </div>
                                </div>
                              }
                             
                              <div className="center flex-row sources-div">
                              <Badge pill>{counter[0][idx]}</Badge>
                              {sources[0] && sources[0][idx] && sources[0][idx].map((source, j) => (
                                domains[0] && domains[0][idx] && domains[0][idx][j] ?
                                <Button variant='delete' size="sm" className='source-button' onClick={() => window.open(source, '_blank')}>{domains[0][idx][j]}</Button>
                                : null
                              ))}
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>:''}
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



