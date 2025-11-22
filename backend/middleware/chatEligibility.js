import Appointment from '../models/appointment.model.js';
import User from '../models/user.model.js';

/**
 * Check if a client is eligible to chat with a specific lawyer
 * Eligibility criteria:
 * 1. Client has a confirmed appointment with paid status
 * 2. OR client has a completed appointment (regardless of payment)
 * 3. Client must be a regular user (not lawyer)
 */
export const checkChatEligibility = async (clientId, lawyerId) => {
  try {
    // Verify client exists and is a regular user
    const client = await User.findById(clientId);
    if (!client || client.userType !== 'user') {
      return {
        eligible: false,
        reason: 'Invalid client or not a regular user'
      };
    }

    // Verify lawyer exists and is a lawyer
    const lawyer = await User.findById(lawyerId);
    if (!lawyer || lawyer.userType !== 'lawyer') {
      return {
        eligible: false,
        reason: 'Invalid lawyer or not a lawyer'
      };
    }

    // Check for eligible appointments
    const eligibleAppointments = await Appointment.find({
      clientId: clientId,
      lawyerId: lawyerId,
      $or: [
        // Confirmed appointment with paid status
        {
          status: 'confirmed',
          paymentStatus: 'paid'
        },
        // Completed appointment (regardless of payment)
        {
          status: 'completed'
        }
      ]
    });

    if (eligibleAppointments.length === 0) {
      return {
        eligible: false,
        reason: 'No eligible appointments found. You need a confirmed and paid appointment or a completed appointment to chat.'
      };
    }

    // Get the most recent eligible appointment
    const latestAppointment = eligibleAppointments.sort((a, b) => 
      new Date(b.appointmentDate) - new Date(a.appointmentDate)
    )[0];

    return {
      eligible: true,
      reason: 'Client is eligible to chat',
      appointment: {
        id: latestAppointment._id,
        status: latestAppointment.status,
        paymentStatus: latestAppointment.paymentStatus,
        appointmentDate: latestAppointment.appointmentDate,
        caseType: latestAppointment.caseType
      }
    };

  } catch (error) {
    console.error('Error checking chat eligibility:', error);
    return {
      eligible: false,
      reason: 'Error checking eligibility'
    };
  }
};

/**
 * Middleware to verify chat eligibility before allowing chat operations
 */
export const verifyChatEligibility = async (req, res, next) => {
  try {
    const { otherUserId } = req.params;
    const currentUserId = req.user.id;
    const currentUserType = req.user.userType;

    // If current user is a lawyer, they can chat with any client
    if (currentUserType === 'lawyer') {
      return next();
    }

    // If current user is a client, check eligibility
    if (currentUserType === 'user') {
      const eligibility = await checkChatEligibility(currentUserId, otherUserId);
      
      if (!eligibility.eligible) {
        return res.status(403).json({
          success: false,
          message: eligibility.reason,
          eligible: false
        });
      }

      // Add eligibility info to request for use in controllers
      req.chatEligibility = eligibility;
    }

    next();
  } catch (error) {
    console.error('Error in chat eligibility middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying chat eligibility'
    });
  }
};

/**
 * Get chat eligibility status for a client-lawyer pair
 */
export const getChatEligibilityStatus = async (req, res) => {
  try {
    const { lawyerId } = req.params;
    const clientId = req.user.id;

    if (req.user.userType !== 'user') {
      return res.status(400).json({
        success: false,
        message: 'Only clients can check chat eligibility'
      });
    }

    const eligibility = await checkChatEligibility(clientId, lawyerId);
    
    res.json({
      success: true,
      ...eligibility
    });

  } catch (error) {
    console.error('Error getting chat eligibility status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking chat eligibility'
    });
  }
};



