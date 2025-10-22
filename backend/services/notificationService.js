import Notification from '../models/Notification.js';

export const createNotification = async (userId, title, description = '') => {
  try {
    const notification = new Notification({
      userId,
      title,
      description,
      read: false
    });
    
    await notification.save();
    
    // Emit real-time notification via socket
    try {
      const { io } = await import('../server.js');
      if (io) {
        io.to(String(userId)).emit('notification', {
          id: notification._id,
          title,
          description,
          read: false,
          createdAt: notification.createdAt
        });
      }
    } catch (socketError) {
      console.warn('Socket emit failed:', socketError?.message || socketError);
    }
    
    console.log(`🔔 Notification created for user ${userId}: ${title}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creating notification:', error);
    return null;
  }
};

export const getNotifications = async (userId, limit = 20) => {
  try {
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return notifications;
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId, userId) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );
    
    return notification;
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    return null;
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );
    
    return true;
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    return false;
  }
};
