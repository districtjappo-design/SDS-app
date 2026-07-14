import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import { FiBell, FiCheck, FiCheckSquare, FiX } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = ({ socket }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  
  useEffect(() => {
    fetchNotifications();
    
    if (socket) {
      socket.on('notification', (newNotif) => {
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }
    
    return () => {
      socket?.off('notification');
    };
  }, [socket]);
  
  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll(20, 0);
      setNotifications(response.data.data);
      
      const unreadResponse = await notificationAPI.getUnreadCount();
      setUnreadCount(unreadResponse.data.count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  
  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'read' } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'read' })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };
  
  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-gray-600 hover:text-blue-600 transition"
      >
        <FiBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {/* Notification Panel */}
      {showPanel && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm bg-white text-blue-600 font-semibold px-2 py-1 rounded hover:bg-blue-50 transition flex items-center gap-1"
              >
                <FiCheckSquare /> Mark all read
              </button>
            )}
          </div>
          
          <div className="divide-y">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications yet</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-l-4 ${
                    notif.status === 'unread'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-gray-50 border-gray-300'
                  } hover:bg-gray-100 transition cursor-pointer`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800">{notif.title}</h4>
                    {notif.status === 'unread' && (
                      <button
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiCheck />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
