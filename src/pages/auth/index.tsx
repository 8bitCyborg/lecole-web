import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import SignUpForm from '../../components/auth/SignUpForm';
import Footer from '../../components/Footer';
import './style.css';

const Auth = () => {
  const location = useLocation();
  const isSignup = location.pathname === '/signup';

  const [displayText, setDisplayText] = useState('');
  const [personaIndex, setPersonaIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const personas = [
    "unlocking your full potential with access to top-tier tutors.",
    "scaling your institution with intelligent management tools.",
    "building your private practice and connecting with students."
  ];

  const typeSpeed = 80;
  const deleteSpeed = 30;
  const pauseTime = 2000;

  useEffect(() => {
    const currentFullText = personas[personaIndex];
    let timer: any;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setPersonaIndex((prev) => (prev + 1) % personas.length);
        }
      }, deleteSpeed);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
        if (displayText.length === currentFullText.length) {
          setTimeout(() => setIsDeleting(true), pauseTime);
        }
      }, typeSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, personaIndex, personas]);

  return (
    <div className="auth-page-wrapper">
      <nav className="navbar auth-navbar">
        <Link to="/" className="nav-logo text-gradient">lecole</Link>
      </nav>

      <main className="auth-container swapped">
        <div className="auth-form-side">
          <div className="auth-form-card">
            {isSignup ? <SignUpForm /> : <LoginForm />}
          </div>
        </div>

        <div className="auth-content-side">
          <div className="auth-content-inner">
            <h1 className="auth-hero-title">
              Elevate your <span className="text-gradient">education journey</span> by...
            </h1>
            <div className="auth-typewriter-container">
              <p className="auth-typewriter-text">
                {displayText}<span className="auth-typewriter-cursor">|</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;