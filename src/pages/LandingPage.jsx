import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ActivityGroupsSection from '../components/ActivityGroupsSection';
import HowItWorks from '../components/HowItWorks';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

function LandingPage({ 
  user, 
  darkMode, 
  toggleDarkMode, 
  onLogout,
  backendGroups,
  loadingGroups,
  joinedGroups,
  onJoinGroup
}) {
  const navigate = useNavigate();

  const openGroupDetail = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="app">
      <Navbar 
        user={user}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onLogout={onLogout}
      />
      
      <Hero />
      
      <Features />
      
      <ActivityGroupsSection
        backendGroups={backendGroups}
        loadingGroups={loadingGroups}
        joinedGroups={joinedGroups}
        onJoinGroup={onJoinGroup}
        onOpenGroupDetail={openGroupDetail}
      />
      
      <HowItWorks />
      
      <CTA user={user} />
      
      <Footer />
    </div>
  );
}

export default LandingPage;
