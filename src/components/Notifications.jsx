import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/Notifications.css';  //css i pages/styles'tan çekiyoruz
import api from '../services/api';

function Notifications({ user, darkMode }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (showDropdown && user) {
      fetchNotifications();
    }
  }, [showDropdown, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/notifications/unread/count');
      if (response.success) {
        setUnreadCount(response.data || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await api.get('/notifications/unread');
      if (response.success) {
        setNotifications(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read
      await api.put(`/notifications/${notification.id}/read`);
      
      // Update local state
      setNotifications(notifications.filter(n => n.id !== notification.id));
      setUnreadCount(Math.max(0, unreadCount - 1));
      
      // Navigate based on notification type
      switch (notification.type) {
        case 'MESSAGE':
          navigate('/messages');
          break;
        case 'FRIEND_REQUEST':
          navigate('/friends');
          break;
        case 'FRIEND_ACCEPT':
          navigate('/friends');
          break;
        case 'GROUP_INVITE':
          navigate('/activity-groups');
          break;
        default:
          break;
      }
      
      setShowDropdown(false);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'MESSAGE':
        return '💬';
      case 'FRIEND_REQUEST':
        return '👋';
      case 'FRIEND_ACCEPT':
        return '🤝';
      case 'GROUP_INVITE':
        return '👥';
      default:
        return '🔔';
    }
  };

  const formatTimeAgo = (timestamp) => {
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

  if (!user) return null;

  return (
    <div className="notifications-container" ref={dropdownRef}>
      <button 
        className="notification-bell"
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {showDropdown && (
        <div className={`notifications-dropdown ${darkMode ? 'dark-mode' : ''}`}>
          <div className="notifications-header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button 
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="notifications-list">
            {loading ? (
              <div className="notifications-loading">
                <div className="spinner-small"></div>
                <p>Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="no-notifications">
                <span className="no-notif-icon">🔔</span>
                <p>No new notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="notification-item"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <h4 className="notification-title">{notification.title}</h4>
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  {!notification.isRead && (
                    <div className="unread-dot"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;