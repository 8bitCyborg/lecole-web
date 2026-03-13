import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Home: React.FC = () => {

  const FeatureList = ({ features, isDark = false }: { features: string[], isDark?: boolean }) => (
    <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {features.map((feature, index) => (
        <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: isDark ? '#e2e8f0' : 'var(--text-main)', fontWeight: '500' }}>
          <div style={{
            minWidth: '24px',
            height: '24px',
            background: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#60a5fa'
          }}>
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
    <div style={{
      position: 'relative',
      width: '100%',
      height: '400px',
      borderRadius: '2rem',
      overflow: 'hidden',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transition: 'transform 0.3s ease'
    }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block'
        }}
      />
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
        pointerEvents: 'none'
      }} />
    </div>
  );

  return (
    <div className="home-page">
      {/* Header / Navbar */}
      <nav className="navbar">
        <div className="nav-logo" style={{
          background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>lecole</div>
        <div className="nav-links" style={{ gap: '1rem' }}>
          <Link to="/login" className="le-button le-button-outline" style={{ height: '2.5rem', paddingInline: '1.5rem', fontSize: '0.9rem', borderColor: '#bfdbfe', color: '#3b82f6' }}>
            Sign In
          </Link>
          <Link to="/signup" className="le-button le-button-primary" style={{ height: '2.5rem', paddingInline: '1.5rem', fontSize: '0.9rem' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="home-hero" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center',
        padding: '0 2rem',
        background: 'radial-gradient(circle at top, #eff6ff 0%, #f8fafc 60%)',
      }}>
        <div style={{ maxWidth: '720px', paddingTop: '4rem' }}>
          <h1 style={{
            fontSize: 'max(3rem, 4vw)',
            fontWeight: '900',
            lineHeight: '1.1',
            marginBottom: '1.25rem',
            color: 'var(--text-main)',
            letterSpacing: '-0.03em',
          }}>
            Elevate learning with <span style={{
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>lecole</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-muted)',
            marginBottom: '2.5rem',
            lineHeight: '1.6',
            maxWidth: '540px',
            marginInline: 'auto'
          }}>
            A modern ecosystem connecting schools, top-tier tutors, and students in a single, powerful platform.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            <Link to="/signup" className="le-button le-button-primary">
              Get Started for Free
            </Link>
            <Link to="/login" className="le-button le-button-outline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Hero image container pulled higher up by reducing its bottom margin, 
            which pulls the dark section following it significantly higher. */}
        <div style={{
          width: '100%',
          maxWidth: '1200px',
          padding: '0 2rem',
          marginTop: '1rem',
          marginBottom: '-16rem',
          zIndex: 10,
          position: 'relative'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '2.5rem',
            boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.15), 0 30px 60px -30px rgba(0, 0, 0, 0.2)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            aspectRatio: '16/9',
            maxHeight: '600px',
            position: 'relative'
          }}>
            {/* Using the generated school dashboard image as the hero preview */}
            <img
              src="/assets/school.png"
              alt="lecole School Dashboard"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
            />
          </div>
        </div>
      </section>

      {/* Unified Solutions Container with Blended Gradient */}
      <div style={{
        background: 'linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: 'white',
        paddingTop: '20rem' /* Padding to clear the negatively-margined hero image */
      }}>
        {/* Section 1: For Schools */}
        <section style={{ padding: '4rem 2rem 8rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '5rem', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#60a5fa', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>For Schools</span>
              <h2 style={{ fontSize: '3rem', fontWeight: '900', margin: '1rem 0', color: '#f8fafc', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                Scale your institution <span style={{ color: '#3b82f6' }}>with intelligence.</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                Centralize your administration, coordinate campus-wide resources, and manage student data to drive better educational outcomes.
              </p>
              <FeatureList features={[
                "Centralized administration hub",
                "Automated attendance and grading",
                "Advanced scheduling and logistics",
                "Unified data analytics and reporting"
              ]} isDark />
            </div>
            {/* Reusing the hero image as the school visual since it's abstract and techy */}
            <VisualContainer src="/assets/hero.png" alt="School management technology" />
          </div>
        </section>

        {/* Section 2: For Tutors */}
        <section style={{ padding: '4rem 2rem 8rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div style={{ order: 1 }}>
              <VisualContainer src="/assets/tutor.png" alt="Educator tools and analytics" />
            </div>
            <div style={{ order: 2 }}>
              <span style={{ color: '#a855f7', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>For Tutors</span>
              <h2 style={{ fontSize: '3rem', fontWeight: '900', margin: '1rem 0', color: '#f8fafc', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
                Build your private practice, <span style={{ color: '#a855f7' }}>connect seamlessly.</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1.25rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                Join our premium network to connect with students outside the formal school system. We handle scheduling and billing so you can focus on teaching.
              </p>
              <FeatureList features={[
                "Global matchmaking with students",
                "Integrated video conferencing",
                "Automated scheduling and payments",
                "Direct and secure communication channels"
              ]} isDark />
              <Link to="/tutors/join" className="le-button le-button-primary" style={{ width: 'auto', marginTop: '1.5rem', paddingInline: '2.5rem' }}>
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
