import React, {useEffect, useState} from "react";
import './Data.css';
import { Navbar, Nav, Container, NavDropdown, Button, Modal, ListGroup, Badge} from 'react-bootstrap';
// import Search from "react-searchbox-awesome";
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import SearchBox from './components/SearchBox';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import CustomNavbar from './components/Navbar';

export default function SearchPage() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [applyClass, setApplyClass] = useState(true);
  const [isScreenWide, setIsScreenWide] = useState(window.innerWidth > 768);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [profile, setProfile] = useState(() => {
    const storedProfile = localStorage.getItem('profile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  });
  const [searchitem, setSearchitem] = useState("");
  const [numberInput, setNumberInput] = useState(4);
  const [limit_, setLimit] = useState(false);
  const [loadingNum, setLoadingNum] = useState(0);
  const [show, setShow] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [timeStamps, setTimeStamps] = useState([]);
  const [desc, setDesc] = useState([]);
  const [price, setPrice] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [sources, setSources] = useState([]);
  const [domains, setDomains] = useState([]);
  const [counter, setCounter] = useState([]);
  const [doneLoading, setDoneLoading] = useState(false);

  useEffect(() => {
    document.body.className= 'bodyData'
    
    // Set favicon and title
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = '/logo.ico';
    document.title = 'Better Search - Find Products';
  }, []);
  
  // Close navbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const navbar = document.querySelector('.navbar-collapse');
      const toggleButton = document.querySelector('.navbar-toggler');
      
      if (isNavExpanded && navbar && !navbar.contains(event.target) && 
          toggleButton && !toggleButton.contains(event.target)) {
        setIsNavExpanded(false);
        setTimeout(() => {
          setApplyClass(true);
        }, 350);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNavExpanded]);
  
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

  const inputHandler = e => {
    const input = e.target.value;
    setSearchitem(input);
  };

  const handleToggle = () => {
    setIsNavExpanded(prev => !prev);
    if (isNavExpanded) {
      setTimeout(() => {
        setApplyClass(true);
      }, 350);
    } else {
      setApplyClass(false);
    }
  };

  async function handleSubmit(searchQuery, numResults){
    if (!!numResults && !!searchQuery)
      {
        await axios.post(
          'https://t5frigw267.execute-api.us-east-1.amazonaws.com/default/dataScraper-dev-data-scraper?query=' + searchQuery + '&num_result=' + numResults + '&user=' + profile.email
        ).then(function (response)
        {
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


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  
  async function waitOnFinish() {
    var prevCount = await axios.get(
      'https://t5frigw267.execute-api.us-east-1.amazonaws.com/default/dataScraper-dev-data-scraper?userID=' + profile.email
    );
    prevCount = prevCount['data']['Count'];
    await until(() => isUpdated(prevCount));
    loadData();
    await until(() => isUpdated(dataList));
    // console.log(dataList);

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

  useEffect(() => {
    const handleResize = () => {
      const newIsScreenWide = window.innerWidth > 768;
      
      // If transitioning from mobile to desktop AND navbar is expanded
      if (newIsScreenWide && !isScreenWide) {
        // Force close navbar and reset state
        setIsNavExpanded(false);
        setApplyClass(true);
        
        // Additional reset to fix any potential styling issues
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse) {
          navbarCollapse.style.height = '';
          navbarCollapse.style.minHeight = '';
          navbarCollapse.classList.remove('show');
        }
      }
      
      setIsScreenWide(newIsScreenWide);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isScreenWide, isNavExpanded]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: custom * 0.1,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    })
  };

  return (
    <div className='main'>
      <CustomNavbar login={login} profile={profile} setProfile={setProfile} />
      <Modal 
        show={show} 
        onHide={handleClose}
        centered
        className="search-complete-modal"
      >
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

      <motion.div 
        className="data fade-in"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={0}
      >
        {profile ? (
          <motion.div
            variants={fadeIn}
            custom={1}
          >
            <div className="search">
              <SearchBox
                onSearch={handleSubmit}
                onNumberChange={setNumberInput}
                searchValue={searchitem}
                numberValue={numberInput}
                isScreenWide={isScreenWide}
                limit={limit_}
                waitOnFinish={waitOnFinish}
                setDoneLoading={setDoneLoading}
              />
            </div>
            
            <motion.div 
              className="datasets bottom-margin"
              variants={fadeIn}
              custom={2}
            >
              {doneLoading ? 
                <ListGroup>
                  {dataList[0].value.map((val, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.5 }}
                    >
                      <ListGroup.Item variant='light' className='listText'> 
                        {isScreenWide ?
                          <div className="img-with-item">
                            <motion.img
                              whileHover={{ scale: 1.05 }}
                              alt=''
                              src={imgs[0][idx]}
                              className="prod-img"
                            />
                            <div className="item-content">
                              <span className="item-title-and-cost">{val} - {price[price.length - 1 - 0][idx]}</span>
                              <p className="item-description">{desc[desc.length - 1 - 0][idx]}</p>
                            </div>
                          </div>
                          :
                          <div className="item-mobile">
                            <div className="img-container">
                              <motion.img
                                whileHover={{ scale: 1.05 }}
                                alt=''
                                src={imgs[0][idx]}
                                className="prod-img"
                              />
                            </div>
                            <div className="item-content-mobile">
                              <span className="item-title-and-cost">{val} - {price[price.length - 1 - 0][idx]}</span>
                              <p className="item-description">{desc[desc.length - 1 - 0][idx]}</p>
                            </div>
                          </div>
                        }
                        
                        <div className="sources-container">
                          <Badge pill className="source-count">{counter[0][idx]}</Badge>
                          <div className="source-buttons">
                            {sources[0] && sources[0][idx] && sources[0][idx].map((source, j) => (
                              domains[0] && domains[0][idx] && domains[0][idx][j] ?
                              <motion.div 
                                key={j}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="source-button-container"
                              >
                                <Button 
                                  variant='delete' 
                                  size="sm" 
                                  className='source-button' 
                                  onClick={() => window.open(source, '_blank')}
                                >
                                  {domains[0][idx][j]}
                                </Button>
                              </motion.div>
                              : null
                            ))}
                          </div>
                        </div>
                      </ListGroup.Item>
                    </motion.div>
                  ))}
                </ListGroup>
              : ''}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            className="login-prompt"
            variants={fadeIn}
            custom={1}
          >
            <h1>Welcome to Better Search</h1>
            <p className="login-desc">Sign in to start searching for products with our advanced AI-powered search engine</p>
            <motion.div 
              className="cta-button-container"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant='delete' size="lg" className="cta-button" onClick={login}>Sign In with Google</Button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <style jsx="true">{`
        .login-prompt {
          max-width: 600px;
          margin: 5rem auto;
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: var(--border-radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: var(--shadow-md);
        }
        
        .login-desc {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          color: var(--neutral-600);
        }
        
        .cta-button-container {
          display: flex;
          justify-content: center;
          margin: 1rem auto;
        }
        
        .cta-button {
          padding: 0.75rem 2rem;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }
        
        .search-complete-modal .modal-content {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: var(--border-radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .img-with-item {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 1rem;
        }
        
        .item-mobile {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .img-container {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-bottom: 0.5rem;
        }
        
        .prod-img {
          width: 120px;
          height: 120px;
          object-fit: contain;
          border-radius: var(--border-radius-sm);
          background-color: white;
          border: 1px solid rgba(0, 0, 0, 0.05);
          padding: 0.5rem;
        }
        
        .item-content {
          flex: 1;
        }
        
        .item-content-mobile {
          text-align: center;
        }
        
        .item-title-and-cost {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--neutral-800);
          margin-bottom: 0.5rem;
          display: block;
        }
        
        .item-description {
          font-size: 0.95rem;
          color: var(--neutral-600);
          line-height: 1.6;
          margin: 0.5rem 0 1rem;
        }
        
        .sources-container {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .source-count {
          background-color: var(--primary-color);
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.5rem 0.75rem;
        }
        
        .source-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .source-button-container {
          display: inline-block;
        }
        
        .source-button {
          font-size: 0.8rem;
          padding: 0.4rem 0.75rem;
          font-weight: 600;
          opacity: 0.9;
        }
        
        .source-button:hover {
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .prod-img {
            width: 100%;
            height: 200px;
            margin: 0 auto;
          }
          
          .item-title-and-cost {
            text-align: center;
          }
          
          .sources-container {
            flex-direction: column;
            align-items: center;
          }
          
          .source-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<RobotStats />);



