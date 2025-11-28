// src/components/NotificationBell.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import './NotificationBell.css';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggle = () => setIsOpen(v => !v);

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <div className="bell-container" onClick={toggle} role="button" aria-label="Notifications">
        <div className="bell-icon">🔔</div>
        <span className={`notification-badge ${unreadCount > 0 ? 'bounce' : ''}`}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            {unreadCount > 0 && <button className="mark-all-btn" onClick={markAllAsRead}>Mark all</button>}
          </div>

          <div className="notification-preview-list">
            {notifications.slice(0, 6).map(n => (
              <div key={n._id} className={`preview-item ${!n.isRead ? 'unread' : ''}`}>
                <div className="left">
                  <div className="title">{n.title}</div>
                  <div className="msg">{n.message}</div>
                </div>
                <div className="right">
                  <small>{new Date(n.createdAt).toLocaleTimeString()}</small>
                </div>
              </div>
            ))}
            {notifications.length === 0 && <div className="empty">No notifications</div>}
          </div>

          <div className="notification-footer">
            <a href="/notifications">View all</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
