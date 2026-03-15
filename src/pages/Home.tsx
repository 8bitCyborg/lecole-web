import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Home: React.FC = () => {

  const FeatureList = ({ features, isDark = false }: { features: string[], isDark?: boolean }) => (
    <ul className="feature-list" style={{ color: isDark ? '#e2e8f0' : 'var(--text-main)' }}>
      {features.map((feature, index) => (
        <li key={index} className="feature-item">
          <div className={`feature-icon-wrapper ${isDark ? 'dark' : ''}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          {feature}
        </li>
      ))}
    </ul>
  );

  const VisualContainer = ({ src, alt }: { src: string, alt: string }) => (
    <div className="visual-container">
      <img
        src={src}
        alt={alt}
        className="visual-image"
      />
      <div className="visual-overlay" />
    </div>
  );

  return (
    <div className="home-page">
      {/* Header / Navbar */}
      <nav className="navbar">
        <div className="nav-logo text-gradient">lecole</div>
        <div className="nav-links">
          <Link to="/login" className="le-button le-button-outline nav-btn">
            Sign In
          </Link>
          <Link to="/signup" className="le-button le-button-primary nav-btn">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Elevate learning with <span className="text-gradient">lecole</span>
          </h1>
          <p className="hero-subtitle">
            A modern ecosystem connecting schools, top-tier tutors, and students in a single, powerful platform.
          </p>

          <div className="hero-buttons">
            <Link to="/signup" className="le-button le-button-primary inline-btn">
              Get Started for Free
            </Link>
            <Link to="/login" className="le-button le-button-outline inline-btn">
              Sign In
            </Link>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="hero-image-inner">
            <img
              src="/assets/school.png"
              alt="lecole School Dashboard"
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Unified Solutions Container with Blended Gradient */}
      <div className="solutions-container">
        {/* Section 1: For Schools */}
        <section className="solution-section">
          <div className="solution-grid">
            <div className="solution-text">
              <span className="solution-tag text-blue">For Schools</span>
              <h2 className="solution-title">
                Scale your institution <span className="text-blue-highlight">with intelligence.</span>
              </h2>
              <p className="solution-description">
                Centralize your administration, coordinate campus-wide resources, and manage student data to drive better educational outcomes.
              </p>
              <FeatureList features={[
                "Centralized administration hub",
                "Automated attendance and grading",
                "Advanced scheduling and logistics",
                "Unified data analytics and reporting"
              ]} isDark />
            </div>
            <div className="solution-visual">
              <VisualContainer src="/assets/hero.png" alt="School management technology" />
            </div>
          </div>
        </section>

        {/* Section 2: For Tutors */}
        <section className="solution-section">
          <div className="solution-grid">
            <div className="solution-visual visual-first">
              <VisualContainer src="/assets/tutor.png" alt="Educator tools and analytics" />
            </div>
            <div className="solution-text text-second">
              <span className="solution-tag text-purple">For Tutors</span>
              <h2 className="solution-title">
                Build your private practice, <span className="text-purple-highlight">connect seamlessly.</span>
              </h2>
              <p className="solution-description">
                Join our premium network to connect with students outside the formal school system. We handle scheduling and billing so you can focus on teaching.
              </p>
              <FeatureList features={[
                "Global matchmaking with students",
                "Integrated video conferencing",
                "Automated scheduling and payments",
                "Direct and secure communication channels"
              ]} isDark />
              <Link to="/tutors/join" className="le-button le-button-primary tutor-join-btn">
                Join the Tutor Network
              </Link>
            </div>
          </div>
        </section>

        {/* Footer inside the dark section */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;
