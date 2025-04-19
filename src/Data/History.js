import React, {useEffect, useState} from "react";
import './Data.css';
import { Navbar, Nav, Container, Accordion, Button, ListGroup, Badge } from 'react-bootstrap';
import axios from 'axios';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { motion, AnimatePresence } from 'framer-motion';
import CustomNavbar from './components/Navbar';

export default function History() {
  useEffect(() => {
    document.body.className= 'bodyData';
    
    // Set favicon and title
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = '/logo.ico';
    document.title = 'Better Search - History';
  }, []);
  
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [profile, setProfile] = useState(() => {
    const storedProfile = localStorage.getItem('profile');
    return storedProfile ? JSON.parse(storedProfile) : null;
  });

  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [applyClass, setApplyClass] = useState(true);

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

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

  const logOut = () => {
    googleLogout();
    setProfile(null);
    localStorage.setItem('profile', null)
    localStorage.setItem('user', null)
  };

  const [dataList, setDataList] = useState([]);
  const [timeStamps, setTimeStamps] = useState([]);
  const [desc, setDesc] = useState([]);
  const [price, setPrice] = useState([]);
  const [imgs, setImgs] = useState([]);
  const [sources, setSources] = useState([]);
  const [domains, setDomains] = useState([]);
  const [counter, setCounter] = useState([]);
  const [deletingIndex, setDeletingIndex] = useState(null);

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

  async function loadData() {
    try {
      const response = await axios.get(
        'https://t5frigw267.execute-api.us-east-1.amazonaws.com/default/dataScraper-dev-data-scraper?userID=' + profile.email
      );
      
      // Add data validation
      if (!response || !response.data) {
        console.error('Invalid response from server:', response);
        return;
      }

      const data = response.data;
      console.log(data);
      // Ensure data.Items exists and is an array
      if (!data || !Array.isArray(data.Items)) {
        console.error('Unexpected data structure:', data);
        return;
      }

      var dataList = []; 
      var timeStamps = [];
      
      // Reset state arrays before populating
      setImgs([]);
      setSources([]);
      setDomains([]);
      setDesc([]);
      setPrice([]);
      setCounter([]);

      for (let i = 0; i < data.Items.length; i++) {
        var keyVal = data.Items[i].title;
        var value = [];
        var descList = [];
        var priceList = [];
        console.log(data.Items[i])
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
        }
        setPrice(tempPrice);

        setDataList(tempDatalistMain.map((item, idx) => tempDatalistMain[tempDatalistMain.length - 1 - idx]));
        setTimeStamps(timeStamps.map((item, idx) => timeStamps[timeStamps.length - 1 - idx]));
        setImgs(tempImgs.map((item, idx) => tempImgs[tempImgs.length - 1 - idx]));
        setSources(tempSources.map((item, idx) => tempSources[tempSources.length - 1 - idx]));
        setDomains(tempDomains.map((item, idx) => tempDomains[tempDomains.length - 1 - idx]));
        setDesc(tempDesc.map((item, idx) => tempDesc[tempDesc.length - 1 - idx]));
        setCounter(tempCounter.map((item, idx) => tempCounter[tempCounter.length - 1 - idx]));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

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

  const accordion = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  // Function to delete a history item
  const deleteHistoryItem = async (timestamp) => {
    try {
      if (!profile || !profile.email) return;
      
      // Set deleting state
      setDeletingIndex(timestamp);
      
      // Use the correct endpoint with timestamp parameter
      await axios.delete(
        'https://t5frigw267.execute-api.us-east-1.amazonaws.com/default/dataScraper-dev-data-scraper?userID=' + profile.email + '&timestamp=' + timestamp
      );
      
      // Reload the page to reflect changes
      window.location.reload();
      
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  return (
    <div className='main'>
      <CustomNavbar login={login} profile={profile} setProfile={setProfile} />

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
            className="history-container"
          >
            <motion.h1
              variants={fadeIn}
              custom={1}
              className="page-title"
            >
              Your Search History
            </motion.h1>
            
            <motion.div 
              className="datasets bottom-margin"
              variants={fadeIn}
              custom={2}
            >
              {dataList && dataList.length > 0 ? (
                <Accordion defaultActiveKey="0" className="search-history">
                  {dataList.map((item, index) => (
                    <motion.div
                      key={index}
                      variants={fadeIn}
                      custom={index + 2}
                      className="accordion-item-wrapper"
                    >
                      <Accordion.Item eventKey={index.toString()} className="history-item">
                        <Accordion.Header className="history-header">
                          <div className="history-header-content">
                            <span className="search-query">{item.key['S']}</span>
                            <div className="history-actions">
                              <span className="search-time">{new Date(timeStamps[index]).toLocaleString()}</span>
                              <Button 
                                variant="outline-danger" 
                                size="sm" 
                                className="delete-history-btn"
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent accordion from toggling
                                  if (window.confirm('Are you sure you want to delete this search history item?')) {
                                    deleteHistoryItem(timeStamps[index]);
                                  }
                                }}
                                disabled={deletingIndex === timeStamps[index]}
                              >
                                {deletingIndex === timeStamps[index] ? 'Deleting...' : 'Delete'}
                              </Button>
                            </div>
                          </div>
                        </Accordion.Header>
                        <AnimatePresence>
                          <Accordion.Body>
                            <ListGroup>
                              {item.value.map((val, idx) => (
                                <motion.div
                                  key={idx}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  variants={accordion}
                                >
                                  <ListGroup.Item variant='light' className='listText'> 
                                    {isScreenWide ?
                                      <div className="img-with-item">
                                        <motion.img
                                          whileHover={{ scale: 1.05 }}
                                          alt=''
                                          src={imgs[index][idx]}
                                          className="prod-img"
                                        />
                                        <div className="item-content">
                                          <span className="item-title-and-cost">{val} - {price[price.length - 1 - index][idx]} 
                                          </span>
                                          <p className="item-description">{desc[desc.length - 1 - index][idx]}</p>
                                        </div>
                                      </div>
                                      :
                                      <div className="item-mobile">
                                        <div className="img-container">
                                          <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            alt=''
                                            src={imgs[index][idx]}
                                            className="prod-img"
                                          />
                                        </div>
                                        <div className="item-content-mobile">
                                          <span className="item-title-and-cost">{val} - {price[price.length - 1 - index][idx]}</span>
                                          <p className="item-description">{desc[desc.length - 1 - index][idx]}</p>
                                        </div>
                                      </div>
                                    }
                                    
                                    <div className="sources-container">
                                      <Badge pill className="source-count">{counter[index][idx]}</Badge>
                                      <div className="source-buttons">
                                        {sources[index] && sources[index][idx] && sources[index][idx].map((source, j) => (
                                          domains[index] && domains[index][idx] && domains[index][idx][j] ?
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
                                              {domains[index][idx][j]}
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
                          </Accordion.Body>
                        </AnimatePresence>
                      </Accordion.Item>
                    </motion.div>
                  ))}
                </Accordion>
              ) : (
                <motion.div 
                  className="no-history"
                  variants={fadeIn}
                  custom={2}
                >
                  <p>No search history yet. Go to the Search page to get started!</p>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="cta-button-container"
                  >
                    <Button 
                      variant="delete" 
                      size="lg" 
                      onClick={() => window.location.href = '/Data/Search'}
                      className="cta-button"
                    >
                      Start Searching
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            className="login-prompt"
            variants={fadeIn}
            custom={1}
          >
            <h1>Welcome to Better Search</h1>
            <p className="login-desc">Sign in to see your search history</p>
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
        .main {
          margin: 0;
          padding: 0;
        }

        .history-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 1rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .page-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          margin: 1rem 0 2rem;
          text-align: center;
          color: var(--neutral-800);
        }
        
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
        
        .no-history {
          text-align: center;
          padding: 3rem;
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: var(--border-radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: var(--shadow-md);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .search-history {
          max-width: 960px;
          margin: 0 auto;
          width: 100%;
        }
        
        .accordion-item-wrapper {
          margin-bottom: 1rem;
        }
        
        .history-item {
          border-radius: var(--border-radius-md) !important;
          overflow: hidden;
          border: none;
          box-shadow: var(--shadow-md);
          background: transparent;
        }
        
        .history-header {
          width: 100%;
        }
        
        .history-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .history-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-right: 10px;
        }
        
        .delete-history-btn {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: var(--border-radius-sm);
          opacity: 0.8;
          transition: var(--transition);
          margin-right: 12px;
        }
        
        .delete-history-btn:hover {
          opacity: 1;
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }
        
        .search-query {
          font-weight: 700;
          font-size: 1.125rem;
          color: var(--neutral-800);
        }
        
        .search-time {
          font-size: 0.875rem;
          color: var(--neutral-500);
          font-weight: 500;
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
        
        .bottom-margin {
          margin-bottom: 3rem;
        }
        
        .datasets {
          width: 100%;
        }
        
        .main-navbar {
          position: relative;
        }
        
        .navbar-brand {
          position: relative;
          z-index: 1030;
        }
        
        .right-navbar-items {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .auth-button {
          position: relative;
          z-index: 1050;
        }
        
        .toggle-button {
          position: relative;
          z-index: 1040;
        }
        
        .nav-bar-center {
          display: flex;
          justify-content: center !important;
          width: 100%;
          margin: 0 auto;
        }
        
        @media (max-width: 768px) {
          .prod-img {
            width: 100%;
            height: 200px;
            margin: 0 auto;
          }
          
          .right-navbar-items {
            gap: 10px;
          }
          
          .auth-button {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
          }
          
          .history-header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
          
          .history-actions {
            width: 100%;
            justify-content: space-between;
            margin-top: 0.5rem;
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
        
        .navbar-collapse {
          transition: height 0.3s ease;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

