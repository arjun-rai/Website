import React from "react";
import {Link, Outlet} from "react-router-dom";

export default function App() {
    return (
      <div>
        <h1>Arjun Rai</h1>
        <nav
            style={{
                borderBottom: "solid 1px",
                paddingBottom: "1rem"
            }}
        >
           <Link to="/">Home </Link> | {" "} 
           <Link to="/TimeCapsule">Time Capsule </Link> 
            
        </nav>
        <Outlet />
      </div>
    );
  }