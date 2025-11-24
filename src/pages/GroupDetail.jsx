import { useState, useEffect } from 'react';
import './styles/GroupDetail.css';

function GroupDetail({ groupId, user }) {
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [members, setMembers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  const categoryIcons = {
    TREKKING: '🏔️',
    HIKING: '🥾',
    CAMPING: '⛺',
    ROAD_TRIPS: '🚗',
    CULTURAL_TOURS: '🏛️',
    BEACH: '🏖️',
  };

  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  const fetchGroupData = async () => {
    try {
      // TODO: Backend API
      const exampleGroup = {
        id: groupId,
        name: 'Mountain Explorers',
        category: 'TREKKING',
        description: 'Join us for exciting mountain trekking adventures',
        memberCount: 45,
        isMember: true
      };

      const exampleMessages = [
        { id: 1, username: 'John', content: 'Hey everyone!', timestamp: new Date() },
        { id: 2, username: 'Sarah', content: 'Count me in!', timestamp: new Date() },
      ];

      const exampleBlogs = [
        { id: 1, title: 'My Himalayan Adventure', author: 'Mike', content: 'Last summer...', createdAt: new Date() },
      ];

      const exampleMembers = [
        { id: 1, username: 'John', email: 'john@example.com' },
        { id: 2, username: 'Sarah', email: 'sarah@example.com' },
      ];

      setGroup(exampleGroup);
      setIsMember(exampleGroup.isMember);
      setMessages(exampleMessages);
      setBlogs(exampleBlogs);
      setMembers(exampleMembers);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      username: user?.name || 'You',
      content: newMessage,
      timestamp: new Date()
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  if (loading) {
    return <div className="group-loading">Loading...</div>;
  }

  return (
    <div className="group-detail-container">
      {/* Group Header */}
      <div className="group-detail-header">
        <div className="group-header-content">
          <div className="group-icon-large">
            {categoryIcons[group?.category] || '🌍'}
          </div>
          <div>
            <h1>{group?.name}</h1>
            <p className="group-desc">{group?.description}</p>
            <div className="group-meta">
              <span>👥 {members.length} members</span>
              <span>📝 {blogs.length} blogs</span>
              <span className="category-badge">{group?.category}</span>
            </div>
          </div>
        </div>
        <div>
          {isMember ? (
            <button onClick={() => alert('Leave group')} className="leave-btn">
              Leave Group
            </button>
          ) : (
            <button onClick={() => setIsMember(true)} className="join-btn">
              Join Group
            </button>
          )}
        </div>
      </div>

      {!isMember ? (
        <div className="non-member-message">
          <p>Join this group to access chat, blogs, and connect with members!</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="group-tabs">
            <div className="tabs-nav">
              <button
                onClick={() => setActiveTab('chat')}
                className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
              >
                💬 Group Chat
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`tab-button ${activeTab === 'blogs' ? 'active' : ''}`}
              >
                📝 Blogs
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`tab-button ${activeTab === 'members' ? 'active' : ''}`}
              >
                👥 Members
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-panel">
              {activeTab === 'chat' && (
                <div className="chat-panel">
                  <div className="messages-area">
                    {messages.length === 0 ? (
                      <p className="empty-chat">No messages yet</p>
                    ) : (
                      messages.map((message) => (
                        <div key={message.id} className="chat-message">
                          <div className="message-avatar">
                            {message.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="message-content">
                            <div className="message-header">
                              <span className="message-username">{message.username}</span>
                              <span className="message-time">
                                {new Date(message.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="message-text">{message.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="message-form">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="message-input"
                    />
                    <button type="submit" className="send-message-btn">Send</button>
                  </form>
                </div>
              )}

              {activeTab === 'blogs' && (
                <div className="blogs-panel">
                  {blogs.length === 0 ? (
                    <p className="empty-blogs">No blogs yet</p>
                  ) : (
                    blogs.map((blog) => (
                      <div key={blog.id} className="blog-item">
                        <div className="blog-author-info">
                          <div className="blog-author-avatar">
                            {blog.author.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="blog-author">{blog.author}</p>
                            <p className="blog-date">
                              {new Date(blog.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <h3 className="blog-title">{blog.title}</h3>
                        <p className="blog-content">{blog.content}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'members' && (
                <div className="members-grid">
                  {members.map((member) => (
                    <div key={member.id} className="member-card">
                      <div className="member-avatar">
                        {member.username.charAt(0).toUpperCase()}
                      </div>
                      <p className="member-name">{member.username}</p>
                      <p className="member-email">{member.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default GroupDetail;
