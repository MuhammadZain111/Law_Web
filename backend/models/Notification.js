import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Notification', notificationSchema)


























