import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Blog.css';
import api from '../services/api.js';

function Blog({ user, onLogout, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });

  const categories = [
    { id: 'ALL', name: 'All Posts', icon: '📝' },
    { id: 'DESTINATIONS', name: 'Destinations', icon: '🌍' },
    { id: 'TIPS', name: 'Travel Tips', icon: '💡' },
    { id: 'STORIES', name: 'Travel Stories', icon: '📖' },
    { id: 'GUIDES', name: 'Guides', icon: '🗺️' },
  ];

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (groups.length > 0) {
      fetchAllBlogs();
    }
  }, [groups]);

  const fetchGroups = async () => {
    try {
      const response = await api.get('/groups');
      if (response.success) {
        setGroups(response.data);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchAllBlogs = async () => {
    setLoading(true);
    try {
      const allBlogs = [];
      for (const group of groups) {
        try {
          const response = await api.get(`/groups/${group.id}/blogs`);
          if (response.success && response.data) {
            allBlogs.push(...response.data);
          }
        } catch (error) {
          console.error(`Error fetching blogs for group ${group.id}:`, error);
        }
      }
      setBlogPosts(allBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupBlogs = async (groupId) => {
    setLoading(true);
    try {
      const response = await api.get(`/groups/${groupId}/blogs`);
      if (response.success) {
        setBlogPosts(response.data);
      }
    } catch (error) {
      console.error('Error fetching group blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!selectedGroup || !user) return;

    try {
      const response = await api.post(`/groups/${selectedGroup.id}/blogs`, {
        title: newBlog.title,
        content: newBlog.content,
        imageUrl: newBlog.imageUrl
      });

      if (response.success) {
        alert('Blog created successfully!');
        setNewBlog({ title: '', content: '', imageUrl: '' });
        setShowCreateForm(false);
        if (selectedGroup) {
          fetchGroupBlogs(selectedGroup.id);
        } else {
          fetchAllBlogs();
        }
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog. Please try again.');
    }
  };

  const handleNavigation = (path) => {
    setShowUserMenu(false);
    navigate(path);
  };

  const handleLogout = () => {
    setShowUserMenu(false);
    onLogout();
    navigate('/');
  };

  const filteredPosts = selectedCategory === 'ALL'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className={`blog-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Page Background */}
      <div className="page-background"></div>

      {/* TravelShare Logo Header */}
      <div className="page-header">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TravelShare</span>
        </div>
        <div className="page-header-right">
          {/* Dark Mode Toggle */}
          <button className="theme-toggle" onClick={toggleDarkMode} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* User Profile Buttons */}
          {user ? (
            <div className="user-menu-container">
              <button className="user-profile-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.name}</span>
              </button>
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-item user-info">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={() => handleNavigation('/profile')}>
                    👤 Profile
                  </button>
                  <button className="dropdown-item" onClick={() => handleNavigation('/activity-groups')}>
                    👥 Activity Groups
                  </button>
                  <button className="dropdown-item" onClick={() => handleNavigation('/messages')}>
                    💬 Messages
                  </button>
                  <button className="dropdown-item" onClick={() => handleNavigation('/friends')}>
                    🤝 Friends
                  </button>
                  <button className="dropdown-item" onClick={() => handleNavigation('/mytrips')}>
                    🗺️ My Trips
                  </button>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-buttons">
              <button className="btn-secondary" onClick={() => navigate('/login')}>Sign In</button>
              <button className="btn-primary" onClick={() => navigate('/register')}>Register</button>
            </div>
          )}
        </div>
      </div>

      {/* Blog Header */}
      <div className="blog-header">
        <h1 className="blog-title">Travel Blog</h1>
        <p className="blog-subtitle">
          Stories, tips, and guides from fellow travelers around the world
        </p>

        {/* Create Blog Button */}
        {user && (
          <button
            className="create-blog-btn"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            ✏️ Write Blog
          </button>
        )}
      </div>

      {/* Create Blog Form */}
      {showCreateForm && user && (
        <div className="create-blog-form">
          <h3>Create New Blog Post</h3>
          <form onSubmit={handleCreateBlog}>
            <div className="form-group">
              <label>Select Group</label>
              <select
                value={selectedGroup?.id || ''}
                onChange={(e) => {
                  const group = groups.find(g => g.id === parseInt(e.target.value));
                  setSelectedGroup(group);
                }}
                required
              >
                <option value="">Choose a group...</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.icon} {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newBlog.title}
                onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                placeholder="Enter blog title"
                required
              />
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                value={newBlog.content}
                onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                placeholder="Write your blog content here..."
                rows="10"
                required
              />
            </div>

            <div className="form-group">
              <label>Image URL (optional)</label>
              <input
                type="url"
                value={newBlog.imageUrl}
                onChange={(e) => setNewBlog({...newBlog, imageUrl: e.target.value})}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">Publish Blog</button>
              <button type="button" onClick={() => setShowCreateForm(false)} className="cancel-btn">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Category Filter */}
      <div className="blog-category-filter">
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

      {/* Blog Posts Grid */}
      <div className="blog-posts-grid">
        {loading ? (
          <div className="loading-blogs">Loading blogs...</div>
        ) : blogPosts.length === 0 ? (
          <div className="no-blogs">No blogs found. Be the first to write one!</div>
        ) : (
          filteredPosts.map((post) => (
            <article key={post.id} className="blog-post-card">
              {/* Post Image */}
              <div className="post-image">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="post-image-emoji">📝</span>
                )}
              </div>

              {/* Post Content */}
              <div className="post-content">
                {/* Group Badge */}
                <span className="post-category">
                  {post.groupName}
                </span>

                {/* Title */}
                <h2 className="post-title">{post.title}</h2>

                {/* Excerpt */}
                <p className="post-excerpt">
                  {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
                </p>

                {/* Post Meta */}
                <div className="post-meta">
                  <span className="post-author">By {post.authorName}</span>
                  <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Read More Button */}
                <button className="read-more-btn">
                  Read More →
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="blog-newsletter">
        <div className="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Get the latest travel stories and tips delivered to your inbox</p>
          <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
            />
            <button className="newsletter-btn">Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
