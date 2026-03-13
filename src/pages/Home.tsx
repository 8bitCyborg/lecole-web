import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="page home">
      <h1>Welcome to L'École</h1>
      <p>Your premium gateway to modern learning experiences.</p>
      <div className="hero-content">
        <div className="card">
          <h3>Explore Courses</h3>
          <p>Discover a wide range of topics curated by experts.</p>
        </div>
        <div className="card">
          <h3>Interactive Learning</h3>
          <p>Engage with dynamic content and real-time feedback.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
