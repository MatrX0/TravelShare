import { useState, useEffect } from 'react';
import './styles/ActivityGroups.css';
import { useNavigate } from 'react-router-dom';

function ActivityGroups({ user, onNavigate, darkMode }) {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'ALL', name: 'All Groups', icon: '🌍' },
    { id: 'TREKKING', name: 'Trekking', icon: '🏔️' },
    { id: 'HIKING', name: 'Hiking', icon: '🥾' },
    { id: 'CAMPING', name: 'Camping', icon: '⛺' },
    { id: 'ROAD_TRIPS', name: 'Road Trips', icon: '🚗' },
    { id: 'CULTURAL_TOURS', name: 'Cultural Tours', icon: '🏛️' },
    { id: 'BEACH', name: 'Beach', icon: '🏖️' },
  ];

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    filterGroups();
  }, [selectedCategory, groups]);

  const fetchGroups = async () => {
    try {
      // TODO: Backend API çağrısı
      const exampleGroups = [
        {
          id: 1,
          name: 'Mountain Explorers',
          category: 'TREKKING',
          description: 'Join us for exciting mountain trekking adventures around the world',
          memberCount: 45,
          blogCount: 12
        },
        {
          id: 2,
          name: 'Beach Lovers',
          category: 'BEACH',
          description: 'Discover the most beautiful beaches and coastal destinations',
          memberCount: 78,
          blogCount: 25
        },
        {
          id: 3,
          name: 'Urban Culture',
          category: 'CULTURAL_TOURS',
          description: 'Explore cities, museums, and cultural heritage sites together',
          memberCount: 62,
          blogCount: 18
        },
        {
          id: 4,
          name: 'Road Trip Adventures',
          category: 'ROAD_TRIPS',
          description: 'Hit the road and explore scenic routes and hidden gems',
          memberCount: 34,
          blogCount: 9
        },
        {
          id: 5,
          name: 'Hiking Enthusiasts',
          category: 'HIKING',
          description: 'Join us for thrilling hiking adventures in nature',
          memberCount: 50,
          blogCount: 15
        },
        {
          id: 6,
          name: 'Camping Crew',
          category: 'CAMPING',
          description: 'Experience the great outdoors with camping trips and tips',
          memberCount: 40,
          blogCount: 10
        },

      ];
      setGroups(exampleGroups);
      setFilteredGroups(exampleGroups);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching groups:', error);
      setLoading(false);
    }
  };

  const filterGroups = () => {
    if (selectedCategory === 'ALL') {
      setFilteredGroups(groups);
    } else {
      setFilteredGroups(groups.filter(group => group.category === selectedCategory));
    }
  };

  if (loading) {
    return (
      <div className="groups-loading">
        <div>Loading groups...</div>
      </div>
    );
  }

  return (
    <div className={`activity-groups-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Page Background */}
      <div className="page-background"></div>

      {/* TravelShare Logo Header */}
      <div className="page-header">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TravelShare</span>
        </div>
      </div>

      {/* Header */}
      <div className="groups-header">
        <h1 className="groups-title">Activity Groups</h1>
        <p className="groups-subtitle">
          Join travel communities and connect with fellow adventurers
        </p>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Groups Grid */}
      <div className="groups-grid">
        {filteredGroups.length === 0 ? (
          <div className="empty-groups">
            <p>No groups found in this category</p>
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div
              key={group.id}
              className="group-item"
              onClick={() => console.log('Navigate to group:', group.id)}
            >
              {/* Category Header */}
              <div className="group-item-header">
                <span className="group-item-icon">
                  {categories.find(c => c.id === group.category)?.icon || '🌍'}
                </span>
                <span className="group-item-badge">{group.category}</span>
              </div>
              <h3 className="group-item-title">{group.name}</h3>

              {/* Group Info */}
              <div className="group-item-body">
                <p className="group-item-description">{group.description}</p>

                <div className="group-item-stats">
                  <span>👥 {group.memberCount} members</span>
                  <span>📝 {group.blogCount || 0} blogs</span>
                </div>

                <button className="group-item-btn">
                  View Details →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ActivityGroups;
