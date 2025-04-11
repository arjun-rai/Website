import React from "react";
import './main.css';
import logo from './imgs/profile.jpeg';
import github from './imgs/github.svg';
// import insta from './imgs/instagram.svg';
import linkedin from './imgs/linkedin.svg';

export default function Main() {
  return (
    <div className="home">
      {/* <img src={logo} className="logo"/>  */}
      <h1>Arjun Rai</h1>
      <p>
          I am a first-year computer science student at Rice University, passionate about building tools and applications that make a real impact.
         <br/>
         <br/> 
         Previously, I developed a GPT-powered product search agent, built an ETL pipeline and recommendation system for semantic search using text embeddings, and helped create a package notification system for Rice students.
         <br/>
         <br/>
         Beyond software, I enjoy hands-on building and tinkering. This past year, I designed and built a 1-lb PLA battle bot and competed in a competition. I also developed a prototype battle bot weapon testing rig for the Rice Robotics Club.
        {/* <ul>
        <li>test</li>
        </ul> */}

        <hr/>
        <a href="mailto:ar255@rice.edu"><span className='center'>ar255@rice.edu</span></a>
        <div className="logos">
        <a href='https://github.com/arjun-rai'> <img src={github} width="50"/></a>
        <a href='https://www.linkedin.com/in/arjun-rye/'><img src={linkedin} width="50"/></a>
        </div>
      </p>
    </div>
    
  );
}