// src/context/NotificationContext.js
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import notificationService from '../api/notificationService';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState({ page: 1, limit: 20, totalPages: 1, total: 0 });
  const socketRef = useRef(null);
  const firstLoadRef = useRef(true);
  const audioRef = useRef(null);

  useEffect(() => {
    // Audio setup (public/notification-sound.mp3 must exist)
    try {
      audioRef.current = new Audio('/notification-sound.mp3');
      audioRef.current.volume = 0.6;
    } catch (e) {
      console.warn('Audio not available', e);
    }
  }, []);

  // Initialize Socket.IO and events
  useEffect(() => {
    const SERVER_URL = process.env.REACT_APP_API_BASE_URL || 'https://hair-salon-app-1.onrender.com';
    try {
      const socket = io(SERVER_URL, { transports: ['websocket'] });
      socketRef.current = socket;

      // attempt to join user room if userId exists in localStorage
      const userId = localStorage.getItem('userId');
      if (userId) socket.emit('join-user', userId);

      socket.on('connect', () => {
        // console.log('Socket connected', socket.id);
      });

      socket.on('new_notification', (payload) => {
        const { notification, unreadCount: serverUnread } = payload || {};
        if (notification) {
          setNotifications((prev) => [notification, ...prev]);
          // server unread takes precedence
          if (typeof serverUnread === 'number') setUnreadCount(serverUnread);
          else setUnreadCount((prev) => prev + (notification.isRead ? 0 : 1));

          // toast popup
          toast.info(notification.title || 'New notification', {
            position: 'top-right',
            autoClose: 5000,
            pauseOnHover: true
          });

          // play sound (skip on first load)
          if (!firstLoadRef.current && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        } else if (typeof serverUnread === 'number') {
          setUnreadCount(serverUnread);
        }
      });

      return () => {
        socket.disconnect();
      };
    } catch (err) {
      console.error('Socket init error:', err);
    }
  }, []);

  // fetch notifications
  const fetchNotifications = async ({ page = 1, limit = 20, unreadOnly = false } = {}) => {
    setLoading(true);
    try {
      const resp = await notificationService.getNotifications({ page, limit, unreadOnly });
      const data = resp.data || {};
      const incoming = Array.isArray(data.notifications) ? data.notifications : [];
      setNotifications((prev) => (page === 1 ? incoming : [...prev, ...incoming]));
      setPageInfo({
        page: data.currentPage || page,
        limit: limit,
        totalPages: data.totalPages || 1,
        total: data.total || (data.notifications?.length || 0),
      });
      setUnreadCount(data.unreadCount ?? 0);
      firstLoadRef.current = false;
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
      return { notifications: [], unreadCount, totalPages: pageInfo.totalPages, currentPage: page };
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const resp = await notificationService.getUnreadCount();
      setUnreadCount(resp.data.unreadCount);
      return resp.data;
    } catch (err) {
      console.error('Error fetching unread count', err);
      return { unreadCount };
    }
  };

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read', err);
      toast.error('Failed to mark notification read');
      throw err;
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all', err);
      toast.error('Failed to mark all as read');
      throw err;
    }
  };

  const deleteNotification = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      const notificationToDelete = notifications.find(n => n._id === id);
      setNotifications((prev) => prev.filter(n => n._id !== id));
      if (notificationToDelete && !notificationToDelete.isRead) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      toast.success('Notification deleted');
    } catch (err) {
      console.error('Error deleting notification', err);
      toast.error('Failed to delete notification');
      throw err;
    }
  };

  const clearAll = async () => {
    try {
      await notificationService.clearAll();
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications cleared');
    } catch (err) {
      console.error('Error clearing notifications', err);
      toast.error('Failed to clear notifications');
      throw err;
    }
  };

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.isRead) setUnreadCount((prev) => prev + 1);
    toast.info(notification.title || 'New notification');
    if (audioRef.current) audioRef.current.play().catch(() => {});
  };

  // load first page on mount
  useEffect(() => {
    (async () => {
      await fetchNotifications({ page: 1, limit: pageInfo.limit });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = async () => {
    if (pageInfo.page >= pageInfo.totalPages) return null;
    const nextPage = pageInfo.page + 1;
    return fetchNotifications({ page: nextPage, limit: pageInfo.limit });
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    pageInfo,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification,
    loadMore,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
