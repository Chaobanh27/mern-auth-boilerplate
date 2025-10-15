import mongoose from 'mongoose'
import validator from 'validator'

const { Schema } = mongoose

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    min: 3,
    max: 30,
    trim: true,
    unique: true,
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },

  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowerCase: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Invalid email format'
    }
  },

  password: {
    type: String,
    required: [true, 'Password is required'],
    min: 8,
    validate: {
      validator: (value) => {
        return (
          validator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          })
        )
      },
      message: 'Password must be at least 8 chars long and include uppercase, lowercase, number, and symbol'
    }
  },

  avatar: {
    type: String,
    default: 'https://picsum.photos/id/237/200/300',
    validate: {
      validator: (value) => validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true }),
      message: 'Invalid URL format for avatar'
    }
  },

  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'roles',
    require: true
  },

  require2FA: {
    type: Boolean,
    default: false
  },

  isActive: {
    type:Boolean,
    default: false
  },

  verifyToken:{
    type:String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  }

}, { collection: 'users', timestamps: true })

const userModel = mongoose.model('User', userSchema)

export default userModel