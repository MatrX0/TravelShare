import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './styles/Messages.css';
import api from '../services/api';

function Messages({ user, onLogout, darkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef(null);
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    // Check if there's a user param in URL (from Friends page)
    const userIdFromUrl = searchParams.get('user');
    if (userIdFromUrl && conversations.length > 0) {
      const conversation = conversations.find(c => c.otherUser.id === parseInt(userIdFromUrl));
      if (conversation) {
        handleSelectConversation(conversation);
      }
    }
  }, [searchParams, conversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.otherUser.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/messages');
      
      if (response.success && response.data) {
        setConversations(response.data);
        
        // Auto-select first conversation if available
        if (response.data.length > 0 && !selectedConversation) {
          setSelectedConversation(response.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await api.get(`/messages/${otherUserId}`);
      
      if (response.success && response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    
    // Mark messages as read
    markMessagesAsRead(conversation.otherUser.id);
  };

  const markMessagesAsRead = async (senderId) => {
    try {
      await api.put(`/messages/${senderId}/read`);
      
      // Update unread count in conversations list
      setConversations(conversations.map(conv => 
        conv.otherUser.id === senderId 
          ? { ...conv, unreadCount: 0 }
          : conv
      ));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;

    const messageContent = newMessage.trim();
    setNewMessage('');
    setSendingMessage(true);

    try {
      const response = await api.post('/messages', {
        receiverId: selectedConversation.otherUser.id,
        content: messageContent
      });

      if (response.success && response.data) {
        // Add new message to list
        setMessages([...messages, response.data]);
        
        // Update conversation's last message
        setConversations(conversations.map(conv =>
          conv.otherUser.id === selectedConversation.otherUser.id
            ? { ...conv, lastMessage: messageContent, lastMessageTime: new Date() }
            : conv
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
      // Restore message if failed
      setNewMessage(messageContent);
    } finally {
      setSendingMessage(false);
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

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="messages-page dark-mode">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`messages-page ${darkMode ? 'dark-mode' : ''}`}>
      {/* Background */}
      <div className="page-background"></div>

      {/* Header */}
      <div className="messages-header-bar">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TravelShare</span>
        </div>
        <div className="header-right">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          {user && (
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
          )}
        </div>
      </div>

      {/* Messages Layout */}
      <div className="messages-layout">
        {/* Conversations Panel */}
        <div className="conversations-panel">
          <div className="conversations-header">
            <h2>💬 Messages</h2>
            <button className="new-message-btn" onClick={() => navigate('/friends')}>
              ➕ New
            </button>
          </div>

          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="empty-conversations">
                <div className="empty-icon">💬</div>
                <p>No conversations yet</p>
                <button className="start-chat-btn" onClick={() => navigate('/friends')}>
                  Start a conversation
                </button>
              </div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation.otherUser.id}
                  className={`conversation-item ${
                    selectedConversation?.otherUser.id === conversation.otherUser.id ? 'active' : ''
                  }`}
                  onClick={() => handleSelectConversation(conversation)}
                >
                  <div className="conversation-avatar">
                    {conversation.otherUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-top">
                      <h4 className="conversation-name">{conversation.otherUser.name}</h4>
                      <span className="conversation-time">
                        {conversation.lastMessageTime ? formatTime(conversation.lastMessageTime) : ''}
                      </span>
                    </div>
                    <div className="conversation-bottom">
                      <p className="conversation-preview">
                        {conversation.lastMessage || 'No messages yet'}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="unread-badge">{conversation.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="chat-panel">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-user-info">
                  <div className="chat-avatar">
                    {selectedConversation.otherUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="chat-username">{selectedConversation.otherUser.name}</h3>
                    <p className="chat-email">{selectedConversation.otherUser.email}</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="messages-area">
                {messages.length === 0 ? (
                  <div className="empty-messages">
                    <div className="empty-icon">💭</div>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${message.isCurrentUser ? 'sent' : 'received'}`}
                    >
                      <div className="message-content">
                        <p className="message-text">{message.content}</p>
                        <span className="message-time">
                          {formatTime(message.sentAt)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="message-input-container">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="message-input"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  className="send-btn"
                  disabled={!newMessage.trim() || sendingMessage}
                >
                  {sendingMessage ? '⏳' : '➤'}
                </button>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="no-conv-icon">💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
