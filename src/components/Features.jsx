const FEATURES = [
  {
    icon: '🗺️',
    title: 'Interactive Route Planning',
    description: 'Create and customize your travel routes on an interactive map with distance calculations and suggested paths.'
  },
  {
    icon: '📅',
    title: 'Daily Activity Planner',
    description: 'Organize your daily travel plans with activities, locations, and personal notes all in one place.'
  },
  {
    icon: '👥',
    title: 'Activity Groups',
    description: 'Join trekking, hiking, camping, road trips, or cultural tour groups to connect with like-minded travelers.'
  },
  {
    icon: '🌤️',
    title: 'Weather Integration',
    description: 'Get real-time weather data to optimize your travel schedules and make informed decisions.'
  },
  {
    icon: '💬',
    title: 'Collaborate & Share',
    description: 'Share travel ideas, create shared routes, and exchange suggestions with your travel community.'
  },
  {
    icon: '🔒',
    title: 'Secure & Organized',
    description: 'Secure login and well-structured profiles ensure your travel data is safe and organized.'
  }
];

function Features() {
  return (
    <section id="features" className="features-section">
      <div className="section-header">
        <h2 className="section-title">Everything You Need for Perfect Travel Planning</h2>
        <p className="section-description">
          Powerful features designed to make your travel planning seamless and enjoyable
        </p>
      </div>
      <div className="features-grid">
        {FEATURES.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
