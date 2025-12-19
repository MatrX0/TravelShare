import PropTypes from 'prop-types';

const FALLBACK_GROUPS = [
  { id: 1, name: '🥾 Trekking', members: '2.3k', color: '#10b981' },
  { id: 2, name: '⛰️ Hiking', members: '1.8k', color: '#3b82f6' },
  { id: 3, name: '🏕️ Camping', members: '1.5k', color: '#f59e0b' },
  { id: 4, name: '🚗 Road Trips', members: '3.1k', color: '#ef4444' },
  { id: 5, name: '🏛️ Cultural Tours', members: '2.7k', color: '#8b5cf6' },
  { id: 6, name: '🏖️ Beach & Coastal', members: '2.1k', color: '#06b6d4' }
];

function ActivityGroupsSection({ 
  backendGroups, 
  loadingGroups, 
  joinedGroups, 
  onJoinGroup, 
  onOpenGroupDetail 
}) {
  const groups = backendGroups.length > 0 ? backendGroups : FALLBACK_GROUPS;

  const isGroupJoined = (groupId) => {
    return joinedGroups.some(jg => jg.id === groupId);
  };

  return (
    <section id="groups" className="groups-section">
      <div className="section-header">
        <h2 className="section-title">Join Activity Groups</h2>
        <p className="section-description">
          Connect with travelers who share your interests and explore together
        </p>
      </div>
      <div className="groups-grid">
        {loadingGroups ? (
          <div className="loading-groups">Loading groups...</div>
        ) : (
          groups.map((group) => {
            const isJoined = group.isMember || isGroupJoined(group.id);
            
            return (
              <div 
                key={group.id} 
                className="group-card" 
                style={{ borderLeftColor: group.color || '#10b981' }}
              >
                <div className="group-header">
                  <h3 className="group-name">
                    {group.icon && `${group.icon} `}{group.name}
                  </h3>
                  <span className="group-badge">
                    {group.memberCount || group.members || 0} members
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={`btn-join ${isJoined ? 'joined' : ''}`}
                    style={{ 
                      backgroundColor: isJoined ? '#10b981' : (group.color || '#10b981') 
                    }}
                    onClick={() => !isJoined && onJoinGroup(group.id, group.name)}
                    disabled={isJoined}
                  >
                    {isJoined ? '✓ Joined' : 'Join Group'}
                  </button>

                  {backendGroups.length > 0 && (
                    <button
                      className="btn-outline"
                      onClick={() => onOpenGroupDetail(group.id)}
                    >
                      View Details
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

ActivityGroupsSection.propTypes = {
  backendGroups: PropTypes.array.isRequired,
  loadingGroups: PropTypes.bool.isRequired,
  joinedGroups: PropTypes.array.isRequired,
  onJoinGroup: PropTypes.func.isRequired,
  onOpenGroupDetail: PropTypes.func.isRequired
};

export default ActivityGroupsSection;
