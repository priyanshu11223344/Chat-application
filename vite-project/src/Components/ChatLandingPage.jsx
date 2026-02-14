import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
export default function ChatLandingPage() {
  const [particles, setParticles] = useState([]);
  const navigate=useNavigate();
  useEffect(() => {
    // Set body and html styles to remove margins and make full screen
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    // Generate particles on mount
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      const size = Math.random() * 100 + 20;
      newParticles.push({
        id: i,
        width: size,
        height: size,
        left: Math.random() * 100,
        top: Math.random() * 100,
        animationDelay: Math.random() * 20,
        animationDuration: Math.random() * 10 + 15,
      });
    }
    setParticles(newParticles);

    // Cleanup function to restore body styles when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleLogin = () => {
  
    navigate("/login")
    // window.location.href = '/login';
  };

  const handleGetStarted = () => {
    alert('Get Started would redirect to signup page');
    // window.location.href = '/signup';
  };

  return (
    <div style={styles.container}>
      {/* Animated Background */}
      <div style={styles.background}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            style={{
              ...styles.particle,
              width: `${particle.width}px`,
              height: `${particle.height}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>💬</div>
          <span>ChatFlow</span>
        </div>
        <button style={styles.loginBtn} onClick={handleLogin}>
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.h1}>
          Connect <span style={styles.gradientText}>Instantly</span>
          <br />
          Chat <span style={styles.gradientText}>Seamlessly</span>
        </h1>
        <p style={styles.subtitle}>
          Experience real-time messaging like never before. Fast, secure, and beautiful.
        </p>
        <div style={styles.ctaButtons}>
          <button style={styles.btnPrimary} onClick={handleGetStarted}>
            Get Started Free
          </button>
          <button style={styles.btnSecondary}>Learn More</button>
        </div>
      </section>

      {/* Chat Preview */}
      <section style={styles.chatPreview}>
        <div style={styles.chatWindow}>
          <Message 
            avatar="JD" 
            text="Hey! How's the new feature coming along?" 
            sent={false}
            delay="0.6s"
          />
          <Message 
            avatar="ME" 
            text="Almost done! Should be ready by tomorrow 🚀" 
            sent={true}
            delay="0.8s"
          />
          <Message 
            avatar="JD" 
            text={<TypingIndicator />} 
            sent={false}
            delay="1s"
          />
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <FeatureCard 
          icon="⚡" 
          title="Lightning Fast" 
          description="Messages delivered instantly with our optimized infrastructure"
          delay="1.2s"
        />
        <FeatureCard 
          icon="🔒" 
          title="End-to-End Encrypted" 
          description="Your conversations stay private with military-grade encryption"
          delay="1.4s"
        />
        <FeatureCard 
          icon="🌍" 
          title="Always Available" 
          description="Access your chats from anywhere, on any device, anytime"
          delay="1.6s"
        />
      </section>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-100px) rotate(180deg);
            opacity: 0.6;
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes messageSlideRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}

function Message({ avatar, text, sent, delay }) {
  const messageStyle = {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
    animation: sent ? `messageSlideRight 0.5s ease-out ${delay} both` : `messageSlide 0.5s ease-out ${delay} both`,
    flexDirection: sent ? 'row-reverse' : 'row',
  };

  const avatarStyle = {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background: sent 
      ? 'linear-gradient(135deg, #f093fb, #f5576c)' 
      : 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    flexShrink: 0,
  };

  const bubbleStyle = {
    background: sent ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#f0f0f0',
    padding: '1rem 1.5rem',
    borderRadius: '20px',
    maxWidth: '70%',
    color: sent ? 'white' : '#333',
  };

  return (
    <div style={messageStyle}>
      <div style={avatarStyle}>{avatar}</div>
      <div style={bubbleStyle}>{text}</div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'inline-flex', gap: '4px' }}>
      <div style={{ ...styles.typingDot, animationDelay: '0s' }} />
      <div style={{ ...styles.typingDot, animationDelay: '0.2s' }} />
      <div style={{ ...styles.typingDot, animationDelay: '0.4s' }} />
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  const [isHovered, setIsHovered] = useState(false);

  const cardStyle = {
    ...styles.featureCard,
    animation: `fadeInUp 1s ease-out ${delay} both`,
    transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
    background: isHovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)',
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.featureIcon}>{icon}</div>
      <h3 style={styles.featureTitle}>{title}</h3>
      <p style={styles.featureDescription}>{description}</p>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
    overflowY: 'auto',
    overflowX: 'hidden',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  background: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 0,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.1)',
    animation: 'float 20s infinite ease-in-out',
  },
  nav: {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 5%',
    animation: 'slideDown 0.8s ease-out',
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
  loginBtn: {
    padding: '0.75rem 2rem',
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  },
  hero: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    padding: '4rem 5% 6rem',
    animation: 'fadeInUp 1s ease-out 0.2s both',
  },
  h1: {
    fontSize: '4rem',
    color: 'white',
    marginBottom: '1.5rem',
    lineHeight: '1.2',
  },
  gradientText: {
    background: 'linear-gradient(90deg, #fff, #a8d8ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '3rem',
    maxWidth: '600px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  ctaButtons: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '1rem 2.5rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'white',
    color: '#667eea',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
  btnSecondary: {
    padding: '1rem 2.5rem',
    fontSize: '1.1rem',
    fontWeight: '600',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '30px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    backdropFilter: 'blur(10px)',
  },
  chatPreview: {
    position: 'relative',
    maxWidth: '800px',
    margin: '0 auto',
    animation: 'fadeInUp 1s ease-out 0.4s both',
  },
  chatWindow: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '20px',
    padding: '2rem',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    backdropFilter: 'blur(10px)',
  },
  features: {
    position: 'relative',
    zIndex: 1,
    padding: '4rem 5%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    padding: '2rem',
    borderRadius: '15px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    color: 'white',
    fontSize: '1.5rem',
    marginBottom: '0.5rem',
  },
  featureDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.6',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#999',
    animation: 'typing 1.4s infinite',
  },
};
