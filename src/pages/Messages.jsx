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
  const [friends, setFriends] = useState([]);
  const [allContacts, setAllContacts] = useState([]); // Conversations + Friends without messages

  useEffect(() => {
    fetchConversations();
    fetchFriends();
  }, []);

  useEffect(() => {
    // Check if there's a user param in URL (from Friends page)
    const userIdFromUrl = searchParams.get('user');
    if (userIdFromUrl && allContacts.length > 0) {
      const contact = allContacts.find(c => c.otherUser.id === parseInt(userIdFromUrl));
      if (contact) {
        handleSelectConversation(contact);
      }
    }
  }, [searchParams, allContacts]);

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
        mergeContactsAndFriends(response.data, friends);
        
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

  const fetchFriends = async () => {
    try {
      const response = await api.get('/friends');
      
      if (response.success && response.data) {
        setFriends(response.data);
        mergeContactsAndFriends(conversations, response.data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const mergeContactsAndFriends = (convs, friendsList) => {
    // Mesaj geçmişi olan kişilerin ID'leri
    const conversationUserIds = convs.map(c => c.otherUser.id);
    
    // Mesajlaşılmamış arkadaşları bul ve konuşma formatına dönüştür
    const friendsWithoutConversations = friendsList
      .filter(friend => !conversationUserIds.includes(friend.userId))
      .map(friend => ({
        otherUser: {
          id: friend.userId,  // Backend'den userId geliyor
          name: friend.name,
          email: friend.email,
          avatarUrl: friend.avatarUrl
        },
        lastMessage: null,
        lastMessageTime: null,
        unreadCount: 0,
        isNewContact: true // Yeni konuşma başlatılacak işareti
      }));
    
    // Tüm kişileri birleştir (önce conversations, sonra yeni arkadaşlar)
    const merged = [...convs, ...friendsWithoutConversations];
    setAllContacts(merged);
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
      const updatedConvs = conversations.map(conv => 
        conv.otherUser.id === senderId 
          ? { ...conv, unreadCount: 0 }
          : conv
      );
      setConversations(updatedConvs);
      mergeContactsAndFriends(updatedConvs, friends);
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
      const receiverId = selectedConversation.otherUser?.id || selectedConversation.otherUser?.userId;
      
      if (!receiverId) {
        alert('Error: Cannot determine receiver ID');
        setNewMessage(messageContent);
        setSendingMessage(false);
        return;
      }
      
      const response = await api.post('/messages', {
        receiverId: receiverId,
        content: messageContent
      });

      if (response.success && response.data) {
        // Add new message to list
        setMessages([...messages, response.data]);
        
        // Update conversation's last message
        const updatedConversations = conversations.map(conv =>
          conv.otherUser.id === selectedConversation.otherUser.id
            ? { ...conv, lastMessage: messageContent, lastMessageTime: new Date() }
            : conv
        );
        setConversations(updatedConversations);
        
        // Eğer yeni bir kontak ise conversations'a ekle
        if (selectedConversation.isNewContact) {
          const newConv = {
            otherUser: selectedConversation.otherUser,
            lastMessage: messageContent,
            lastMessageTime: new Date(),
            unreadCount: 0,
            isNewContact: false
          };
          const newConvs = [newConv, ...conversations.filter(c => c.otherUser.id !== selectedConversation.otherUser.id)];
          setConversations(newConvs);
          mergeContactsAndFriends(newConvs, friends);
          setSelectedConversation(newConv);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Failed to send message. ';
      if (error.response?.data?.message) {
        errorMessage += error.response.data.message;
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
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

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: darkMode ? '#1e293b' : '#ffffff',
    border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
    padding: '10px 20px',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    color: darkMode ? '#f1f5f9' : '#1e293b',
    transition: 'all 0.3s ease'
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            style={backButtonStyle}
            onClick={() => navigate("/")}
            onMouseEnter={(e) => e.target.style.borderColor = '#667eea'}
            onMouseLeave={(e) => e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0'}
          >
            <span>←</span>
            <span>Home</span>
          </button>

          <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="logo-icon">✈️</span>
            <span className="logo-text">ShareWay</span>
          </div>
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
            {allContacts.length === 0 ? (
              <div className="empty-conversations">
                <div className="empty-icon">👥</div>
                <p>No friends yet</p>
                <p className="empty-subtitle">Add friends to start messaging!</p>
                <button className="start-chat-btn" onClick={() => navigate('/friends')}>
                  👤 Find Friends
                </button>
              </div>
            ) : (
              allContacts.map((contact) => (
                <div
                  key={contact.otherUser.id}
                  className={`conversation-item ${
                    selectedConversation?.otherUser.id === contact.otherUser.id ? 'active' : ''
                  } ${contact.isNewContact ? 'new-contact' : ''}`}
                  onClick={() => handleSelectConversation(contact)}
                >
                  <div className="conversation-avatar">
                    {contact.otherUser.avatarUrl ? (
                      <img src={contact.otherUser.avatarUrl} alt={contact.otherUser.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      contact.otherUser.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="conversation-info">
                    <div className="conversation-top">
                      <h4 className="conversation-name">{contact.otherUser.name}</h4>
                      <span className="conversation-time">
                        {contact.lastMessageTime ? formatTime(contact.lastMessageTime) : ''}
                      </span>
                    </div>
                    <div className="conversation-bottom">
                      <p className="conversation-preview">
                        {contact.lastMessage || (contact.isNewContact ? 'Start a conversation' : 'No messages yet')}
                      </p>
                      {contact.unreadCount > 0 && (
                        <span className="unread-badge">{contact.unreadCount}</span>
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
                    {selectedConversation.otherUser.avatarUrl ? (
                      <img src={selectedConversation.otherUser.avatarUrl} alt={selectedConversation.otherUser.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      selectedConversation.otherUser.name.charAt(0).toUpperCase()
                    )}
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