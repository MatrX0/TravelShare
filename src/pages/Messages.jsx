import { useState, useEffect } from 'react';
import './styles/Messages.css';

function Messages({ user, onNavigate, darkMode }) {
  const [conversations, setConversations] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages(selectedFriend.id);
    }
  }, [selectedFriend]);

  const fetchConversations = async () => {
    try {
      // TODO: Backend API
      const exampleConversations = [
        {
          friend: { id: 1, username: '', email: '' },
          lastMessage: '',
          unreadCount: 2
        },
        {
          friend: { id: 2, username: '', email: '' },
          lastMessage: '',
          unreadCount: 0
        },
      ];
      
      setConversations(exampleConversations);
      if (exampleConversations.length > 0) {
        setSelectedFriend(exampleConversations[0].friend);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (friendId) => {
    try {
      // TODO: Backend API
      const exampleMessages = [
        { id: 1, content: '', isSender: false, timestamp: new Date(Date.now() - 3600000) },
        { id: 2, content: '', isSender: true, timestamp: new Date(Date.now() - 3000000) },
      ];
      
      setMessages(exampleMessages);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedFriend) return;

    const newMsg = {
      id: Date.now(),
      content: newMessage,
      isSender: true,
      timestamp: new Date()
    };
    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  if (loading) {
    return <div className="messages-loading">Loading messages...</div>;
  }

  return (
    <div className={`messages-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Page Background */}
      <div className="page-background"></div>

      {/* TravelShare Logo Header */}
      <div className="page-header">
        <div className="logo" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <span className="logo-icon">✈️</span>
          <span className="logo-text">TravelShare</span>
        </div>
      </div>

      <div className="messages-layout">
        {/* Conversations List */}
        <div className="conversations-panel">
          <div className="conversations-header">
            <h2>Messages</h2>
          </div>
          <div className="conversations-list">
            {conversations.length === 0 ? (
              <div className="empty-conversations">No conversations yet</div>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.friend.id}
                  onClick={() => setSelectedFriend(conversation.friend)}
                  className={`conversation-item ${selectedFriend?.id === conversation.friend.id ? 'active' : ''}`}
                >
                  <div className="conversation-avatar">
                    {conversation.friend.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="conversation-info">
                    <p className="conversation-name">{conversation.friend.username}</p>
                    <p className="conversation-last">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="unread-badge">{conversation.unreadCount}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="messages-panel">
          {selectedFriend ? (
            <>
              {/* Chat Header */}
              <div className="messages-header">
                <div className="chat-avatar">
                  {selectedFriend.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="chat-name">{selectedFriend.username}</p>
                  <p className="chat-email">{selectedFriend.email}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-list">
                {messages.length === 0 ? (
                  <div className="empty-messages">No messages yet</div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className={`message ${message.isSender ? 'sent' : 'received'}`}>
                      <div className="message-bubble">
                        <p className="message-content">{message.content}</p>
                        <p className="message-time">
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="messages-input">
                <form onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="message-field"
                  />
                  <button type="submit" className="send-btn">Send</button>
                </form>
              </div>
            </>
          ) : (
            <div className="no-selection">Select a conversation to start messaging</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
