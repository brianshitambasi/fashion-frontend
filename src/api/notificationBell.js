import api from './api'; // Your existing API instance

const notificationService = {
  // Get user notifications
  getNotifications: (params = {}) => {
    return api.get('/notifications', { params });
  },

  // Get unread count
  getUnreadCount: () => {
    return api.get('/notifications/unread/count');
  },

  // Mark as read
  markAsRead: (id) => {
    return api.put(`/notifications/${id}/read`);
  },

  // Mark all as read
  markAllAsRead: () => {
    return api.put('/notifications/read-all');
  },

  // Delete notification
  deleteNotification: (id) => {
    return api.delete(`/notifications/${id}`);
  },

  // Clear all notifications
  clearAll: () => {
    return api.delete('/notifications');
  }
};

export default notificationService;