import { useState, useEffect } from 'react';
import './styles/GroupDetail.css';
import api from '../services/api.js';

// eslint-disable-next-line no-unused-vars
function GroupDetail({ groupId, user }) {
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('chat');
  // eslint-disable-next-line no-unused-vars
  const [messages, setMessages] = useState([]);
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

  /* ================= FETCH DATA ================= */

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

  /* ================= BLOG CREATE ================= */

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!newBlog.title || !newBlog.content) return;

    try {
      const res = await api.post(
        `/groups/${groupId}/blogs`,
        newBlog
      );

      if (res.success) {
        setBlogs(prev => [res.data, ...prev]);
        setNewBlog({ title: '', content: '', imageUrl: '' });
      }
    } catch (err) {
      console.error('Blog creation failed', err);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return <div className="group-loading">Loading...</div>;
  }

  return (
    <div className="group-detail-container">

      {/* ===== HEADER ===== */}
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
          Join this group to access content
        </div>
      ) : (
        <>
          {/* ===== TABS ===== */}
          <div className="group-tabs">
            <div className="tabs-nav">
              {/* <button onClick={() => setActiveTab('chat')} className={activeTab === 'chat' ? 'active' : ''}>
                💬 Chat
              </button> */}
              <button onClick={() => setActiveTab('blogs')} className={activeTab === 'blogs' ? 'active' : ''}>
                📝 Blogs
              </button>
              <button onClick={() => setActiveTab('members')} className={activeTab === 'members' ? 'active' : ''}>
                👥 Members
              </button>
            </div>

            {/* ===== CHAT (placeholder kept) =====
            {activeTab === 'chat' && (
              <div className="chat-panel">
                <p className="empty-chat">Chat system coming later</p>
              </div>
            )} */}

            {/* ===== BLOGS ===== */}
            {activeTab === 'blogs' && (
              <div className="blogs-panel">

                {/* CREATE BLOG */}
                <form onSubmit={handleCreateBlog} className="create-blog-form">
                  <input
                    type="text"
                    placeholder="Blog title"
                    value={newBlog.title}
                    onChange={e => setNewBlog({ ...newBlog, title: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Write your blog..."
                    value={newBlog.content}
                    onChange={e => setNewBlog({ ...newBlog, content: e.target.value })}
                    required
                  />
                  <input
                    type="url"
                    placeholder="Image URL (optional)"
                    value={newBlog.imageUrl}
                    onChange={e => setNewBlog({ ...newBlog, imageUrl: e.target.value })}
                  />
                  <button type="submit">Publish</button>
                </form>

                {/* BLOG LIST */}
                {blogs.length === 0 ? (
                  <p className="empty-blogs">No blogs yet</p>
                ) : (
                  blogs.map(blog => (
                    <div key={blog.id} className="blog-item">
                      <h3>{blog.title}</h3>
                      <p className="blog-author">By {blog.authorName}</p>
                      <p>{blog.content}</p>
                      <small>{new Date(blog.createdAt).toLocaleDateString()}</small>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ===== MEMBERS ===== */}
            {activeTab === 'members' && (
              <div className="members-grid">
                {members.map(member => (
                  <div key={member.userId} className="member-card">
                    <div className="member-avatar">
                      {(member.name || '?')[0].toUpperCase()}
                    </div>
                    <p className="member-name">{member.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default GroupDetail;
