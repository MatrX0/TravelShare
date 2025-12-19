import { useNavigate } from 'react-router-dom';
import adventureText from '../matrx.png';

function Hero() {
  const navigate = useNavigate();

  const scrollToGroups = () => {
    const groupsSection = document.querySelector("#groups");
    if (groupsSection) {
      groupsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="hero" id="home">
      <div className="hero-content">
        <h1 className="hero-title">
          Plan, Share, and Explore Your
          <img 
            src={adventureText} 
            alt="Your Adventures" 
            className="hero-title-img"
          />
        </h1>
        <p className="hero-description">
          Create interactive travel routes, join activity groups, and collaborate with fellow travelers.
          Your journey begins here with smart planning and a vibrant community.
        </p>
        <div className="hero-buttons">
          <button
            className="btn-large btn-primary"
            onClick={() => navigate('/maps')}
          >
            Start Planning
          </button>

          <button
            className="btn-large btn-outline"
            onClick={scrollToGroups}
          >
            Explore Groups
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat">
            {/* Stats can be added later */}
          </div>
          <div className="stat">
            {/* Stats can be added later */}
          </div>
          <div className="stat">
            {/* Stats can be added later */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
