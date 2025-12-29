import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/GroupDetail.css';
import api from '../services/api.js';

function GroupDetail({ user, darkMode }) {
  const { groupId } = useParams(); // Get groupId from URL
  const navigate = useNavigate();
  
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('blogs');
  const [blogs, setBlogs] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);

  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });

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
      const [groupRes, blogRes, memberRes] = await Promise.all([
        api.get(`/groups/${groupId}`),
        api.get(`/groups/${groupId}/blogs`),
        api.get(`/groups/${groupId}/members`)
      ]);

      if (groupRes.success) {
        setGroup(groupRes.data);
        setIsMember(groupRes.data.isMember);
      }

      if (blogRes.success) {
        setBlogs(blogRes.data);
      }

      if (memberRes.success) {
        setMembers(memberRes.data);
      }

    } catch (err) {
      console.error('Failed to load group detail', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) {
      alert('Please fill in both title and content!');
      return;
    }

    try {
      const blogData = {
        title: newBlog.title.trim(),
        content: newBlog.content.trim(),
        imageUrl: newBlog.imageUrl.trim() || null
      };
      
      console.log('Creating blog with data:', blogData);
      
      const res = await api.post(
        `/groups/${groupId}/blogs`,
        blogData
      );

      console.log('Blog creation response:', res);

      if (res.success) {
        setBlogs(prev => [res.data, ...prev]);
        setNewBlog({ title: '', content: '', imageUrl: '' });
        alert('Blog created successfully!');
      } else {
        throw new Error(res.message || 'Failed to create blog');
      }
    } catch (err) {
      console.error('Blog creation failed', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create blog. Please try again.';
      alert(errorMsg);
    }
  };

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'white',
    border: '2px solid #e2e8f0',
    padding: '10px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    transition: 'all 0.3s ease',
    marginBottom: '20px'
  };

  if (loading) {
    return (
      <div className="group-loading">
        <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid rgba(102, 126, 234, 0.2)', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
        <div>Loading group...</div>
      </div>
    );
  }

  return (
    <div className={`group-detail-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Back Button */}
      <button 
        style={backButtonStyle}
        onClick={() => navigate('/')}
        onMouseEnter={(e) => e.target.style.borderColor = '#667eea'}
        onMouseLeave={(e) => e.target.style.borderColor = '#e2e8f0'}
      >
        <span>←</span>
        <span>Back to Home</span>
      </button>

      {/* Header */}
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
            </div>
          </div>
        </div>
      </div>

      {!isMember ? (
        <div className="non-member-message">
          <div style={{ fontSize: '60px', marginBottom: '20px', opacity: 0.5 }}>🔒</div>
          <h3>Join this group to access content</h3>
          <p style={{ color: '#9ca3af', marginTop: '10px' }}>Become a member to view blogs and chat with other travelers</p>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="group-tabs">
            <div className="tabs-nav">
              <button 
                onClick={() => setActiveTab('blogs')} 
                className={activeTab === 'blogs' ? 'active tab-button' : 'tab-button'}
              >
                📝 Blogs
              </button>
              <button 
                onClick={() => setActiveTab('members')} 
                className={activeTab === 'members' ? 'active tab-button' : 'tab-button'}
              >
                👥 Members
              </button>
            </div>

            <div className="tab-panel">
              {/* Blogs Tab */}
              {activeTab === 'blogs' && (
                <div className="blogs-panel">
                  {/* Create Blog Form */}
                  <form onSubmit={handleCreateBlog} className="create-blog-form" style={{ background: '#f9fafb', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: '600' }}>✍️ Create New Blog</h3>
                    <input
                      type="text"
                      placeholder="Blog title"
                      value={newBlog.title}
                      onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '12px', fontSize: '15px' }}
                    />
                    <textarea
                      placeholder="Write your blog..."
                      value={newBlog.content}
                      onChange={e => setNewBlog({ ...newBlog, content: e.target.value })}
                      required
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '12px', fontSize: '15px', minHeight: '120px', resize: 'vertical' }}
                    />
                    <input
                      type="url"
                      placeholder="Image URL (optional)"
                      value={newBlog.imageUrl}
                      onChange={e => setNewBlog({ ...newBlog, imageUrl: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', marginBottom: '12px', fontSize: '15px' }}
                    />
                    <button type="submit" style={{ background: '#667eea', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', width: '100%' }}>
                      📤 Publish Blog
                    </button>
                  </form>

                  {/* Blog List */}
                  {blogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>📝</div>
                      <p className="empty-blogs" style={{ color: '#6b7280', fontSize: '16px' }}>No blogs yet. Be the first to share!</p>
                    </div>
                  ) : (
                    blogs.map(blog => (
                      <div key={blog.id} className="blog-item">
                        <div className="blog-author-info">
                          <div className="blog-author-avatar">
                            {(blog.authorName || '?')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="blog-author">{blog.authorName}</p>
                            <p className="blog-date">{new Date(blog.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <h3 className="blog-title">{blog.title}</h3>
                        <p className="blog-content">{blog.content}</p>
                        {blog.imageUrl && (
                          <img src={blog.imageUrl} alt={blog.title} style={{ width: '100%', borderRadius: '8px', marginTop: '15px' }} />
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Members Tab */}
              {activeTab === 'members' && (
                <div className="members-grid">
                  {members.map(member => (
                    <div key={member.userId} className="member-card">
                      <div className="member-avatar">
                        {(member.name || '?')[0].toUpperCase()}
                      </div>
                      <p className="member-name">{member.name}</p>
                      <p className="member-email">{member.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default GroupDetail;