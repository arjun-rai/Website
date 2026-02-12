import React from "react";
import './main.css';
import logo from './imgs/profile.jpeg';
import github from './imgs/github.svg';
// import insta from './imgs/instagram.svg';
import linkedin from './imgs/linkedin.svg';

export default function Main() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-kicker">Rice CS • Builder • Robotics</div>
          <h1>
            Designing software and machines that turn bold ideas into real-world
            tools.
          </h1>
          <p className="hero-lede">
            I’m Arjun Rai, a first-year computer science student at Rice
            University. I build intelligent systems, data pipelines, and
            hands-on robotics projects that ship fast and make impact.
          </p>
          <div className="hero-cta">
            <a className="cta primary" href="mailto:ar255@rice.edu">Start a project</a>
            <a className="cta ghost" href="PortfolioPage">See work</a>
          </div>
          <div className="hero-metrics">
            <div className="metric">
              <span className="metric-value">3</span>
              <span className="metric-label">AI + data systems shipped</span>
            </div>
            <div className="metric">
              <span className="metric-value">2</span>
              <span className="metric-label">Robotics builds in 2024</span>
            </div>
            <div className="metric">
              <span className="metric-value">1 lb</span>
              <span className="metric-label">Battle bot class</span>
            </div>
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-image">
            <img src={logo} alt="Arjun Rai" />
          </div>
          <div className="hero-card-body">
            <h2>Current focus</h2>
            <ul>
              <li>GPT-powered product search + semantic retrieval</li>
              <li>ETL + recommendation pipelines with embeddings</li>
              <li>Battle bot drivetrain + weapon testing rigs</li>
            </ul>
          </div>
          <div className="hero-links">
            <a href='https://github.com/arjun-rai'>
              <img src={github} width="36" alt="GitHub" />
            </a>
            <a href='https://www.linkedin.com/in/arjun-rye/'>
              <img src={linkedin} width="36" alt="LinkedIn" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
