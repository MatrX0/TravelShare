import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

function CTA({ user }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      navigate('/register');
    }
  };

  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2 className="cta-title">Ready to Start Your Adventure?</h2>
        <p className="cta-description">
          Join thousands of travelers planning their perfect trips with TravelShare
        </p>
        <button 
          className="btn-large btn-primary" 
          onClick={handleClick}
        >
          {user ? 'Explore Now' : 'Create Free Account'}
        </button>
      </div>
    </section>
  );
}

CTA.propTypes = {
  user: PropTypes.object
};

export default CTA;
