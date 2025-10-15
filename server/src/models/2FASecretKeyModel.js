import mongoose from 'mongoose'

const { Schema } = mongoose

const twoFASecretKeySchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
}, { collection: '2fa_secret_keys', timestamps: true })

const twoFASecretKeyModel = mongoose.model('TwoFASecretKey', twoFASecretKeySchema)

export default twoFASecretKeyModel
