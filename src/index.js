import React from 'react';
import ReactDOM from 'react-dom';
import { 
    BrowserRouter,
    Routes,
    Route         
 } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './TimeCapsule/serviceWorker';
import TimeCapsule from './TimeCapsule/TimeCapsule';
import RobotStats from './RobotStats/RobotStats';
import Home from './Home';
import Portfolio from './PortfolioPage';
import Data from './Data/Data';
import Login from './Data/Login'
import Datasets from './Data/Datasets'
import { GoogleOAuthProvider } from "@react-oauth/google"
import 'bootstrap/dist/css/bootstrap.min.css';


const rootElement = document.getElementById('root');
ReactDOM.render(
<GoogleOAuthProvider clientId='1062416901391-3sctju20tsjg2laqqj6iqv4mnsirad1u.apps.googleusercontent.com'>
<BrowserRouter>
    <Routes>
        <Route exact path="/" element={<App />}>
        <Route exact path="/" element={<Home />}/>
        <Route exact path="TimeCapsule" element={<TimeCapsule />} />
        <Route exact path="RobotStats" element={<RobotStats />} />
        <Route exact path="PortfolioPage" element={<Portfolio />} />
        <Route exact path="Data" element={<Data />} />
        <Route exact path="/Data/Login" element={<Login />} />
        <Route exact path="/Data/Datasets" element={<Datasets />} />
        </Route>
    </Routes>
</BrowserRouter> 
</GoogleOAuthProvider>,
rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
