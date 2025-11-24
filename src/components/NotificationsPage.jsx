import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';

const NotificationsPage = () => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll,
    fetchNotifications 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all'); // 'all', 'unread'

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityBadge = (priority) => {
    const priorityColors = {
      high: 'danger',
      medium: 'warning',
      low: 'success'
    };
    
    return (
      <span className={`badge bg-${priorityColors[priority] || 'secondary'}`}>
        {priority}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    const icons = {
      booking: '📅',
      payment: '💳',
      review: '⭐',
      announcement: '📢',
      system: '⚙️'
    };
    return icons[type] || '🔔';
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification._id);
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Notifications</h1>
            <div>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="btn btn-primary me-2"
                >
                  Mark All as Read
                </button>
              )}
              <button 
                onClick={clearAll}
                className="btn btn-outline-danger"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('all')}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setFilter('unread')}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="card">
            <div className="card-body p-0">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>🔔</div>
                  <h5>No notifications</h5>
                  <p className="text-muted">
                    {filter === 'unread' 
                      ? "You're all caught up! No unread notifications." 
                      : "You don't have any notifications yet."
                    }
                  </p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredNotifications.map(notification => (
                    <div
                      key={notification._id}
                      className={`list-group-item list-group-item-action ${
                        !notification.isRead ? 'bg-light' : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="d-flex align-items-start">
                        <div className="me-3" style={{ fontSize: '1.5rem' }}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="mb-0">
                              {notification.title}
                              {!notification.isRead && (
                                <span className="badge bg-primary ms-2">New</span>
                              )}
                            </h6>
                            <div className="d-flex align-items-center">
                              {getPriorityBadge(notification.priority)}
                              <small className="text-muted ms-2">
                                {formatDate(notification.createdAt)}
                              </small>
                            </div>
                          </div>
                          <p className="mb-1 text-muted">{notification.message}</p>
                          {notification.actionUrl && (
                            <small className="text-primary">
                              Click to view details →
                            </small>
                          )}
                        </div>
                        <div className="ms-3">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification._id);
                            }}
                            title="Delete notification"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;