import express from 'express';
import auth from '../middleware/auth.js';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from '../services/notificationService.js';

const router = express.Router();

// Get user notifications
router.get('/', auth(), async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const { limit = 20 } = req.query;
    
    const notifications = await getNotifications(userId, parseInt(limit));
    
    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// Mark notification as read
router.put('/:id/read', auth(), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId || req.user.id;
    
    const notification = await markNotificationAsRead(id, userId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read'
    });
  }
});

// Mark all notifications as read
router.put('/read-all', auth(), async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    
    const success = await markAllNotificationsAsRead(userId);
    
    res.status(200).json({
      success,
      message: success ? 'All notifications marked as read' : 'Failed to mark notifications as read'
    });
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
});

export default router;
