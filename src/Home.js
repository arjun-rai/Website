import React from "react";
import './Home.css';
import logo from './imgs/profile.jpeg';

export default function Home() {
  return (
    <div className="home">
      <img src={logo} className="logo"/> 
    </div>
    
  );
}