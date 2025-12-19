const STEPS = [
  {
    number: '1',
    title: 'Create Your Profile',
    description: 'Sign up and set up your traveler profile with your interests and preferences'
  },
  {
    number: '2',
    title: 'Plan Your Route',
    description: 'Use our interactive map to create routes, add activities, and organize your itinerary'
  },
  {
    number: '3',
    title: 'Share & Collaborate',
    description: 'Join groups, share your plans, and get inspired by fellow travelers'
  }
];

function HowItWorks() {
  return (
    <section className="how-it-works">
      <div className="section-header">
        <h2 className="section-title">How It Works</h2>
        <p className="section-description">Get started in three simple steps</p>
      </div>
      <div className="steps-container">
        {STEPS.map((step) => (
          <div key={step.number} className="step">
            <div className="step-number">{step.number}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;
