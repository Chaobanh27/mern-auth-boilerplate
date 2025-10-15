import mongoose from 'mongoose'

const { Schema } = mongoose

const userSessionSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    deviceId: {
      type: String,
      required: true
    },
    is2FAVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: String,
      default: 'not-set'
    }
  },
  { collection: 'user_sessions', timestamps: true }
)

const userSessionModel = mongoose.model('UserSession', userSessionSchema)


export default userSessionModel
