// src/pages/NotificationsPage.jsx
import React, { useEffect, useRef, useCallback } from 'react';
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
    pageInfo,
    fetchNotifications,
    loadMore
  } = useNotifications();

  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    // load first page
    fetchNotifications({ page: 1, limit: pageInfo.limit });
    // eslint-disable-next-line
  }, []);

  // IntersectionObserver to infinite-load
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // load more when sentinel appears
          if (pageInfo.page < pageInfo.totalPages) {
            loadMore();
          }
        }
      });
    }, { root: null, rootMargin: '200px', threshold: 0.1 });

    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current.disconnect();
    // eslint-disable-next-line
  }, [pageInfo.page, pageInfo.totalPages]);

  // Mark-as-read on entering viewport for each unread item
  const itemObserversRef = useRef(new Map());
  const setItemObserver = useCallback((node, id, isRead) => {
    if (!node || isRead) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // mark as read and unobserve
          markAsRead(id).catch(() => {});
          const obs = itemObserversRef.current.get(id);
          if (obs) {
            obs.disconnect();
            itemObserversRef.current.delete(id);
          }
        }
      });
    }, { root: null, threshold: 0.5 });

    observer.observe(node);
    itemObserversRef.current.set(id, observer);
  }, [markAsRead]);

  const formatDate = (d) => new Date(d).toLocaleString();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Notifications</h1>
        <div>
          {unreadCount > 0 && <button onClick={markAllAsRead} className="btn btn-primary me-2">Mark All</button>}
          <button onClick={clearAll} className="btn btn-outline-danger">Clear All</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          {notifications.length === 0 && !loading ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '3rem' }}>🔔</div>
              <h5>No notifications</h5>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {notifications.map(n => (
                <div
                  key={n._id}
                  ref={el => setItemObserver(el, n._id, n.isRead)}
                  className={`list-group-item ${!n.isRead ? 'bg-light' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-start">
                    <div className="me-3" style={{ fontSize: '1.5rem' }}>
                      {n.type === 'booking' ? '📅' : n.type === 'payment' ? '💳' : '🔔'}
                    </div>
                    <div className="flex-grow-1" onClick={() => markAsRead(n._id)}>
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className="mb-0">{n.title} {!n.isRead && <span className="badge bg-primary ms-2">New</span>}</h6>
                        <small className="text-muted">{formatDate(n.createdAt)}</small>
                      </div>
                      <p className="mb-1 text-muted">{n.message}</p>
                      {n.actionUrl && <small className="text-primary">Click to view →</small>}
                    </div>
                    <div className="ms-3">
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteNotification(n._id)}>×</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="p-3 text-center">
            {loading ? <div className="spinner-border" role="status" /> : (
              pageInfo.page >= pageInfo.totalPages ? (
                <div className="text-muted">No more notifications</div>
              ) : (
                <div ref={sentinelRef}><button className="btn btn-outline-primary" onClick={() => loadMore()}>Load more</button></div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
