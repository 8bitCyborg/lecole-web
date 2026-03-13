import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      padding: '4rem',
      textAlign: 'center',
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      color: 'rgba(255, 255, 255, 0.4)'
    }}>
      <div style={{
        fontSize: '1.5rem',
        fontWeight: '900',
        color: 'white',
        marginBottom: '1rem',
        letterSpacing: '-0.5px'
      }}>
        lecole
      </div>
      <p style={{ margin: 0 }}>&copy; 2026 lecole. Educating the future.</p>
    </footer>
  );
};

export default Footer;
