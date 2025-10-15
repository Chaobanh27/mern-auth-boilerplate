import mongoose from 'mongoose'

const { Schema } = mongoose

const roleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // đảm bảo mỗi role chỉ có 1 tên duy nhất
      trim: true
    },
    permissions: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => {
          return arr.length > 0 // đảm bảo không để mảng rỗng
        },
        message: 'Role phải có ít nhất 1 permission'
      }
    }
  },
  { collection: 'roles', timestamps: true }
)

const roleModel = mongoose.model('roles', roleSchema)

export default roleModel
