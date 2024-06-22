import React from 'react';
import ReactDOM from 'react-dom';
import { 
    BrowserRouter,
    Routes,
    Route         
 } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import TimeCapsule from './TimeCapsule';
import RobotStats from './RobotStats';
import Home from './Home';
import Portfolio from './PortfolioPage';
import Data from './Data';


const rootElement = document.getElementById('root');
ReactDOM.render(
<BrowserRouter>
    <Routes>
        <Route exact path="/" element={<App />}>
        <Route exact path="/" element={<Home />}/>
        <Route exact path="TimeCapsule" element={<TimeCapsule />} />
        <Route exact path="RobotStats" element={<RobotStats />} />
        <Route exact path="PortfolioPage" element={<Portfolio />} />
        <Route exact path="Data" element={<Data />} />
        </Route>
    </Routes>
</BrowserRouter> ,
rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
