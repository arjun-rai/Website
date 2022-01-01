import React from "react";
import {Link, Outlet} from "react-router-dom";
import './App.css';

export default function App() {
    return (
      <div>
        <h1 className='container'>Arjun Rai</h1>
        <nav className='container'
            style={{
                borderBottom: "solid 1px",
                paddingBottom: "1rem"
            }}
        >
           <Link to="/">Home </Link> | {" "} 
           <Link to="/TimeCapsule">Time Capsule</Link> 
            
        </nav>
        <Outlet />
      </div>
    );
  }