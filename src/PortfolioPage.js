import React, { useEffect, useState, useRef, useCallback } from 'react';
import './PortfolioPage.css';

// Text Scramble Effect Hook
const useTextScramble = () => {
  const chars = '!<>-_\\/[]{}—=+*^?#________';

  const scramble = useCallback((element, finalText) => {
    let iteration = 0;
    const originalText = finalText;

    const interval = setInterval(() => {
      element.innerText = originalText
        .split('')
        .map((char, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= originalText.length) {
        clearInterval(interval);
      }

      iteration += 1 / 2;
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return scramble;
};

// Magnetic Button Component
const MagneticButton = ({ children, className, href, target, rel }) => {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;

    const btnText = btn.querySelector('.btn-text');
    if (btnText) {
      btnText.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    }
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;

    btn.style.transform = 'translate(0, 0)';
    const btnText = btn.querySelector('.btn-text');
    if (btnText) {
      btnText.style.transform = 'translate(0, 0)';
    }
  };

  return (
    <a
      ref={btnRef}
      className={`magnetic-btn ${className}`}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="btn-text">{children}</span>
    </a>
  );
};

// Scramble Text Component
const ScrambleText = ({ text, className }) => {
  const textRef = useRef(null);
  const scramble = useTextScramble();

  const handleMouseEnter = () => {
    if (textRef.current) {
      scramble(textRef.current, text);
    }
  };

  return (
    <span
      ref={textRef}
      className={`scramble-text ${className || ''}`}
      onMouseEnter={handleMouseEnter}
    >
      {text}
    </span>
  );
};

const PortfolioPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef(null);

  useEffect(() => {
    const targets = document.querySelectorAll('.reveal-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -10% 0px' }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const highlights = [
    { label: 'School', value: 'Rice University' },
    { label: 'Focus', value: 'CS + AI' },
    { label: 'GPA', value: '3.91' },
    { label: 'Location', value: 'Houston, TX' },
  ];

  const projects = [
    {
      name: 'BranchBite',
      link: 'https://branchbite.com',
      description:
        'Recipe management platform with AI-powered imports, collaboration, and nutrition tooling.',
      stack: 'Next.js · AWS (Lambda, S3, RDS) · MySQL · Tailwind · LLMs',
    },
    {
      name: 'OwlConnect',
      description:
        'Agentic mentor matching platform using multi-agent negotiation for Rice students.',
      stack: 'Model Context Protocol · LangChain · FastAPI · MongoDB',
      meta: 'HackRice 15',
    },
  ];

  const experience = [
    {
      role: 'Full-Stack Software Engineer',
      org: 'Freshcuts (Startup)',
      date: 'Oct 2025 – Present',
      location: 'Houston, TX',
      summary:
        'Owning product, iOS, backend, and infra for a cut-first barber booking platform with virtual try-ons.',
    },
    {
      role: 'Software Engineer',
      org: 'RiceApps',
      date: 'Oct 2024 – Present',
      location: 'Houston, TX',
      summary:
        'Building real-time voice-based interview practice platform using WebSockets, Cartesia, and LLM feedback.',
    },
    {
      role: 'Software Engineering Intern',
      org: 'Code Wiz',
      date: 'May 2025 – Aug 2025',
      location: 'Dallas, TX',
      summary:
        'Shipped a class management platform with NestJS/Postgres and a 90% faster AI report workflow.',
    },
    {
      role: 'Software Engineering Intern',
      org: 'Gently (Startup)',
      date: 'Jun 2023 – Oct 2023',
      location: 'San Francisco, CA',
      summary:
        'Built ETL pipeline for semantic search used by 100k+ users, created embedding-based recommendation system, and presented vector search visualizations using Nomic Atlas.',
    },
    {
      role: 'Research Intern',
      org: 'University of Texas at Dallas',
      date: 'Jun 2023 – Aug 2023',
      location: 'Dallas, TX',
      summary:
        'Applied evidential deep learning and Actor-Critic RL to improve autonomous vehicle trajectory prediction.',
    },
  ];

  const skills = [
    { label: 'Languages', items: 'Java, Python, C/C++, SQL, TypeScript, Swift' },
    { label: 'Frontend', items: 'React, Next.js, Tailwind, SwiftUI, ShadCN' },
    { label: 'Backend', items: 'Node.js, NestJS, FastAPI, Supabase, AWS, GCP' },
    { label: 'Data/ML', items: 'PyTorch, TensorFlow, LangChain, Pinecone, CUDA' },
    { label: 'Tools', items: 'Git, Docker, Linux, CloudWatch' },
  ];

  const featuredProjects = [
    {
      name: 'BranchBite',
      tagline: 'AI-Powered Recipe Platform',
      description: 'Recipe management with AI imports, collaboration, and nutrition tooling.',
      stack: ['Next.js', 'AWS', 'MySQL', 'LLMs'],
      color: 'coral',
      link: 'https://branchbite.com',
    },
    {
      name: 'OwlConnect',
      tagline: 'Agentic Mentor Matching',
      description: 'Multi-agent negotiation platform for Rice student mentorship.',
      stack: ['MCP', 'LangChain', 'FastAPI'],
      color: 'teal',
    },
    {
      name: 'Freshcuts',
      tagline: 'Barber Booking Platform',
      description: 'iOS app with virtual try-ons and cut-first booking flow.',
      stack: ['Swift', 'SwiftUI', 'Firebase', 'Supabase', 'LLMs'],
      color: 'gold',
    },
  ];

  return (
    <div className="portfolio">
      {/* Noise Texture Overlay */}
      <div className="noise-overlay" />

      <div className="page-shell">
        <header className="hero hero-3d" ref={heroRef}>
          {/* Parallax Background Layers */}
          <div className="hero-bg-layers">
            <div
              className="bg-layer layer-1"
              style={{
                transform: `translate(${(mousePosition.x - 0.5) * -30}px, ${(mousePosition.y - 0.5) * -30}px)`
              }}
            />
            <div
              className="bg-layer layer-2"
              style={{
                transform: `translate(${(mousePosition.x - 0.5) * -20}px, ${(mousePosition.y - 0.5) * -20}px)`
              }}
            />
            <div
              className="bg-layer layer-3"
              style={{
                transform: `translate(${(mousePosition.x - 0.5) * -10}px, ${(mousePosition.y - 0.5) * -10}px)`
              }}
            />
          </div>

          {/* Floating Orbs */}
          <div className="floating-orbs">
            <div className="orb orb-1" style={{
              transform: `translate(${(mousePosition.x - 0.5) * 40}px, ${(mousePosition.y - 0.5) * 40}px)`
            }} />
            <div className="orb orb-2" style={{
              transform: `translate(${(mousePosition.x - 0.5) * -25}px, ${(mousePosition.y - 0.5) * -25}px)`
            }} />
            <div className="orb orb-3" style={{
              transform: `translate(${(mousePosition.x - 0.5) * 35}px, ${(mousePosition.y - 0.5) * -20}px)`
            }} />
          </div>

          {/* Cursor Glow - fades out near bottom */}
          <div
            className="cursor-glow"
            style={{
              left: `${mousePosition.x * 100}%`,
              top: `${mousePosition.y * 100}%`,
              opacity: mousePosition.y > 0.7 ? Math.max(0, 1 - (mousePosition.y - 0.7) * 3.33) : 1,
            }}
          />

          {/* Hero Content */}
          <div className="hero-content-3d">
            {/* Left: Intro */}
            <div className="hero-intro reveal-on-scroll" style={{ transitionDelay: '0.1s' }}>
              <div className="intro-badge">
                <span className="badge-dot" />
                <span>Available for opportunities</span>
              </div>
              <h1 className="hero-name">
                <span className="name-line">Arjun</span>
                <span className="name-line accent">Rai</span>
              </h1>
              <p className="hero-tagline">
                Building polished systems at the intersection of <em>AI</em>, <em>data</em>, and <em>product</em>.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-value">3.91</span>
                  <span className="stat-label">GPA</span>
                </div>
                <div className="stat">
                  <span className="stat-value">4+</span>
                  <span className="stat-label">Shipped Products</span>
                </div>
                <div className="stat">
                  <span className="stat-value">Rice</span>
                  <span className="stat-label">CS + AI</span>
                </div>
              </div>
              <div className="hero-cta">
                <MagneticButton className="cta-primary" href="mailto:ar255@rice.edu">
                  Get in touch
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </MagneticButton>
                <MagneticButton className="cta-secondary" href="https://github.com/arjun-rai" target="_blank" rel="noreferrer">
                  GitHub
                </MagneticButton>
                <MagneticButton className="cta-secondary" href="https://www.linkedin.com/in/arjun-rye/" target="_blank" rel="noreferrer">
                  LinkedIn
                </MagneticButton>
              </div>
            </div>

            {/* Right: 3D Project Cards */}
            <div className="hero-projects reveal-on-scroll" style={{ transitionDelay: '0.2s' }}>
              <div className="projects-header">
                <span className="projects-label">Featured Work</span>
                <div className="projects-line" />
              </div>
              <div className="project-stack">
                {featuredProjects.map((project, index) => {
                  const rotateX = (mousePosition.y - 0.5) * -15;
                  const rotateY = (mousePosition.x - 0.5) * 15;
                  const translateZ = 20 + index * 10;

                  return (
                    <div
                      key={project.name}
                      className={`project-card-3d card-${project.color}`}
                      style={{
                        transform: `
                          perspective(1000px)
                          rotateX(${rotateX}deg)
                          rotateY(${rotateY}deg)
                          translateZ(${translateZ}px)
                          translateY(${index * -8}px)
                        `,
                        zIndex: featuredProjects.length - index,
                        transitionDelay: `${0.1 + index * 0.08}s`,
                      }}
                    >
                      <div className="card-glow" />
                      <div className="card-content">
                        <div className="card-header">
                          <h3><ScrambleText text={project.name} /></h3>
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noreferrer" className="card-link">
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M4 10L10 4M10 4H5M10 4v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </a>
                          )}
                        </div>
                        <p className="card-tagline"><ScrambleText text={project.tagline} /></p>
                        <p className="card-desc">{project.description}</p>
                        <div className="card-stack">
                          {project.stack.map((tech) => (
                            <span key={tech} className="tech-tag">{tech}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="scroll-hint">
                <span>Scroll to explore</span>
                <div className="scroll-arrow">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4v12M6 12l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="highlights">
          <div className="highlight-strip">
            {highlights.map((item, index) => (
              <div
                key={item.label}
                className="highlight-line reveal-on-scroll"
                style={{ transitionDelay: `${0.1 + index * 0.06}s` }}
              >
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <div className="content-columns">
        <section className="section">
          <div className="section-header">
            <h2><ScrambleText text="Selected Projects" /></h2>
          </div>
          <div className="project-grid">
            {projects.map((project, index) => (
              <article
                key={project.name}
                className="project-card reveal-on-scroll"
                style={{ transitionDelay: `${0.14 + index * 0.08}s` }}
              >
                <div className="project-head">
                  <h3><ScrambleText text={project.name} /></h3>
                  {project.link ? (
                    <a href={project.link} target="_blank" rel="noreferrer" className="project-link">
                      Visit
                    </a>
                  ) : (
                    <span className="ghost">Private</span>
                  )}
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-meta">
                  <span>{project.stack}</span>
                  {project.meta ? <span>{project.meta}</span> : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2><ScrambleText text="Experience" /></h2>
          </div>
          <div className="timeline">
            {experience.map((role, index) => (
              <div
                key={`${role.org}-${role.role}`}
                className="timeline-item reveal-on-scroll"
                style={{ transitionDelay: `${0.18 + index * 0.06}s` }}
              >
                <div className="timeline-title">
                  <h3><ScrambleText text={role.role} /></h3>
                  <span><ScrambleText text={role.org} /></span>
                </div>
                <div className="timeline-meta">
                  <span>{role.date}</span>
                  <span>{role.location}</span>
                </div>
                <p className="timeline-summary">{role.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <h2><ScrambleText text="Skills" /></h2>
          </div>
          <div className="skills-stream">
            {skills.map((skill, index) => (
              <div
                key={skill.label}
                className="skill-line reveal-on-scroll"
                style={{ transitionDelay: `${0.2 + index * 0.06}s` }}
              >
                <span><ScrambleText text={skill.label} /></span>
                <p>{skill.items}</p>
              </div>
            ))}
          </div>
        </section>
        </div>

      </div>
    </div>
  );
};

export default PortfolioPage;
