import React, { useEffect } from 'react';
import {
  Link,
  Navigate,
  NavLink,
  Outlet,
  useLocation,
  useParams,
} from 'react-router-dom';
import './PortfolioPage.css';
import { experience, projects, skillGroups } from './portfolioData';

const Arrow = () => (
  <svg aria-hidden="true" className="arrow" viewBox="0 0 20 20" fill="none">
    <path d="M3.5 10h12M11 5.5l4.5 4.5-4.5 4.5" />
  </svg>
);

const PageMeta = ({ title, description }) => {
  useEffect(() => {
    document.title = title ? `${title} — Arjun Rai` : 'Arjun Rai';
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute('content', description);
  }, [title, description]);

  return null;
};

const navItems = [
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact' },
];

export default function SiteLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    document.body.classList.toggle('home-scroll-locked', isHome);
    document.documentElement.classList.toggle('home-scroll-locked', isHome);

    const anchor = location.hash.slice(1);
    const anchorTarget = anchor && document.getElementById(anchor);
    if (anchorTarget) anchorTarget.scrollIntoView();
    else window.scrollTo(0, 0);

    const favicon = document.querySelector("link[rel~='icon']");
    if (favicon) favicon.href = '/favicon.svg';

    return () => {
      document.body.classList.remove('home-scroll-locked');
      document.documentElement.classList.remove('home-scroll-locked');
    };
  }, [isHome, location.pathname, location.hash]);

  return (
    <div className={`portfolio-site${isHome ? ' is-home' : ''}`}>
      <a className="skip-link" href="#main-content">Skip to content</a>

      {!isHome && (
        <header className="site-header">
          <Link className="wordmark" to="/" aria-label="Arjun Rai, home">AR</Link>
          <nav className="site-navigation" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
      )}

      <Outlet />

      {!isHome && (
        <footer className="site-footer">
          <a href="mailto:ar255@rice.edu">Email</a>
          <a href="https://www.linkedin.com/in/arjun-rye/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a href="https://github.com/arjun-rai" target="_blank" rel="noreferrer">GitHub ↗</a>
          <span>© 2026</span>
        </footer>
      )}
    </div>
  );
}

const RailSection = ({ title, id, children }) => (
  <section className="rail-section" id={id}>
    <h2>{title}</h2>
    <div className="rail-content">{children}</div>
  </section>
);

const ProjectCard = ({ project }) => (
  <article className="project-card" id={project.slug}>
    <div className="project-card-heading">
      <h2>{project.name}</h2>
      {project.externalUrl && (
        <a href={project.externalUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${project.name}`}>
          ↗
        </a>
      )}
    </div>
    <p>{project.shortDescription}</p>
    <div className="badge-list" aria-label={`${project.name} technology stack`}>
      {project.stack.map((item) => <span key={item}>{item}</span>)}
    </div>
    {project.award && <small>{project.award}</small>}
  </article>
);

const ExperienceList = () => (
  <div className="experience-list">
    {experience.map((item) => (
      <article className="experience-item" key={`${item.company}-${item.role}`}>
        <div className="experience-meta">
          <span>{item.date}</span>
          <span>{item.location}</span>
        </div>
        <div className="experience-body">
          <h3>{item.role}</h3>
          <p>{item.company}</p>
        </div>
      </article>
    ))}
  </div>
);

export function HomePage() {
  return (
    <main className="fold-home" id="main-content">
      <PageMeta description="Arjun Rai — software, machine learning, and robotics." />

      <section className="fold-name" aria-label="Arjun Rai">
        <h1><span>ARJUN</span><span>RAI</span></h1>
      </section>

      <nav className="fold-index" aria-label="Site sections">
        <Link to="/about"><span>About</span></Link>
        <Link to="/about#experience"><span>Experience</span></Link>
        <Link to="/projects"><span>Projects</span></Link>
      </nav>
    </main>
  );
}

export function ProjectsPage() {
  return (
    <main className="compact-page" id="main-content">
      <PageMeta title="Projects" description="Projects by Arjun Rai." />
      <header className="page-title"><h1>Projects</h1></header>
      <div className="project-grid">
        {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
      </div>
    </main>
  );
}

export function LegacyProjectRedirect() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  return <Navigate replace to={project ? `/projects#${project.slug}` : '/projects'} />;
}

export function LegacyWorkRedirect() {
  return <Navigate replace to="/about" />;
}

export function AboutPage() {
  return (
    <main className="compact-page" id="main-content">
      <PageMeta title="About" description="About Arjun Rai." />
      <header className="page-title"><h1>About</h1></header>

      <div className="fact-grid" aria-label="Background">
        <div><span>Based in</span><strong>Houston + San Francisco</strong></div>
        <div><span>Studying</span><strong>Computer Science + AI</strong></div>
        <div><span>Rice</span><strong>Class of 2028 · 3.91 GPA</strong></div>
      </div>

      <RailSection title="Experience" id="experience">
        <ExperienceList />
      </RailSection>

      <RailSection title="Skills">
        <div className="skill-groups">
          {skillGroups.map((group) => (
            <section key={group.title}>
              <h3>{group.title}</h3>
              <div className="badge-list">
                {group.items.map((item) => <span key={item}>{item}</span>)}
              </div>
            </section>
          ))}
        </div>
      </RailSection>
    </main>
  );
}

export function ContactPage() {
  return (
    <main className="compact-page contact-page" id="main-content">
      <PageMeta title="Contact" description="Contact Arjun Rai." />
      <header className="page-title"><h1>Contact</h1></header>
      <nav className="contact-links" aria-label="Contact links">
        <a href="mailto:ar255@rice.edu"><span>Email</span><strong>ar255@rice.edu</strong><Arrow /></a>
        <a href="https://www.linkedin.com/in/arjun-rye/" target="_blank" rel="noreferrer"><span>LinkedIn</span><strong>arjun-rye</strong><Arrow /></a>
        <a href="https://github.com/arjun-rai" target="_blank" rel="noreferrer"><span>GitHub</span><strong>arjun-rai</strong><Arrow /></a>
      </nav>
    </main>
  );
}

export function NotFoundPage() {
  return (
    <main className="compact-page not-found" id="main-content">
      <PageMeta title="Page not found" description="The requested page could not be found." />
      <h1>404</h1>
      <Link to="/">Home <Arrow /></Link>
    </main>
  );
}
