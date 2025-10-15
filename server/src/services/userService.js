/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import userModel from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import bcryptjs from 'bcryptjs'
import { env } from '~/config/environment'
import { v4 as uuidv4 } from 'uuid'
import { JwtProvider } from '~/providers/JwtProvider'
import { pickUser } from '~/utils/formatters'
import { MailerSendProvider } from '~/providers/MailerSendProvider'
import { MAILER_SEND_TEMPLATE_IDS, WEBSITE_DOMAIN } from '~/utils/constants'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
import twoFASecretKeyModel from '~/models/2FASecretKeyModel'
import userSessionModel from '~/models/userSessionModel'
import { authenticator } from 'otplib'
import Qrcode from 'qrcode'
import { SERVICE_NAME } from '~/utils/constants'
import crypto from 'crypto'
import mongoose from 'mongoose'
import roleModel from '~/models/roleModel'


const createNew = async (reqBody) => {
  try {
    const { email, password } = reqBody
    const existUser = await userModel.findOne({ email })
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exist')
    }

    const nameFromEmail = email.split('@')[0]
    const newUser = {
      email: email,
      password: bcryptjs.hashSync(password, 8),
      username: nameFromEmail,
      verifyToken: uuidv4()
    }

    const user = new userModel(newUser)
    const createdUser = await user.save()

    const to = createdUser.email
    const toName = createdUser.username
    const subject = 'hello Chaobanh'
    const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${createdUser.email}&token=${createdUser.verifyToken}`

    const templateId = MAILER_SEND_TEMPLATE_IDS.REGISER_ACCOUNT

    const personalizationData = [
      {
        email: to,
        data: {
          name: 'ChaoBanh',
          account_name: toName,
          verification_link: verificationLink
        }
      }
    ]

    await MailerSendProvider.sendEmail({
      to,
      toName,
      subject,
      templateId,
      personalizationData
    })

    return createdUser
  } catch (error) {
    throw (error)
  }

}

const verifyAccount = async (reqBody) => {
  try {
    const { email } = reqBody
    const existUser = await userModel.findOne({ email })

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is already active!')
    if (reqBody.token !== existUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid!')
    }

    const updateData = {
      isActive: true,
      verifyToken: null
    }

    const updatedUser = await userModel.updateOne({ _id : existUser._id }, updateData)

    return pickUser(updatedUser)
  } catch (error) {
    throw (error)
  }

}

const login = async (reqBody, reqHeader) => {
  try {
    const { email, password } = reqBody
    const existUser = await userModel.findOne({ email }).populate('role')

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')
    if (!bcryptjs.compareSync(password, existUser.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')
    }

    const userInfo = {
      _id: existUser._id,
      email: existUser.email,
      role: existUser.role?.name
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    )

    let resUser = pickUser(existUser)


    let currentUserSession = await userSessionModel.findOne({
      userId : existUser._id,
      deviceId: reqHeader
    })

    if (!currentUserSession) {
      currentUserSession = await userSessionModel.create({
        userId: existUser._id,
        deviceId: reqHeader,
        is2FAVerified: false,
        lastLogin: new Date()
      })
    }

    resUser['is2FAVerified'] = currentUserSession.is2FAVerified
    resUser['lastLogin'] = currentUserSession.lastLogin

    return {
      accessToken,
      refreshToken,
      ...resUser
    }
  } catch (error) {
    throw (error)
  }

}

const refreshToken = async (clientRefreshToken) => {
  try {
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    )

    return { accessToken }
  } catch (error) { throw error }
}

const update = async (userId, reqBody, userAvatarFile) => {
  try {
    const { currentPassword, newPassword } = reqBody
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    if (!existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!')

    let updatedUser = {}

    if (currentPassword && newPassword) {
      if (!bcryptjs.compareSync(currentPassword, existUser.password)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Current Password is incorrect!')
      }
      updatedUser = await userModel.findOneAndUpdate(
        { _id: existUser._id },
        { $set: { password: bcryptjs.hashSync(newPassword, 8) } },
        { new: true }
      )
    }
    else if (userAvatarFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(userAvatarFile.buffer, 'users')

      updatedUser = await userModel.findOneAndUpdate(
        { _id: existUser._id },
        { $set:{ avatar: uploadResult.secure_url } },
        { new: true }
      )
    }
    else {
      updatedUser = await userModel.findOneAndUpdate(
        { _id:existUser._id }, reqBody, { new: true })
    }

    return {
      ...pickUser(updatedUser)
    }
  } catch (error) { throw error }
}

const getUser = async (userId, reqHeader) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    }

    let resUser = pickUser(existUser)

    const currentUserSession = await userSessionModel.findOne({
      userId : existUser._id,
      deviceId: reqHeader
    })
    resUser['is2FAVerified'] = currentUserSession ? currentUserSession.is2FAVerified : null
    resUser['lastLogin'] = currentUserSession ? currentUserSession.lastLogin : null

    return pickUser(existUser)
  } catch (error) {
    throw (error)
  }
}

const getAllUsers = async (userId, reqQuery) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    }

    const page = parseInt(reqQuery.page) || 1
    const limit = parseInt(reqQuery.limit) || 10
    const skip = (page - 1) * limit

    const search = reqQuery.search || ''
    const role = reqQuery.role || ''
    const status = reqQuery.status
    const sortBy = reqQuery.sortBy || 'createdAt'
    const order = reqQuery.order === 'asc' ? 1 : -1

    let filter = {}


    if (role) {
      filter.role = new mongoose.Types.ObjectId(role)
    }

    if (status == 'Active') filter.isActive = true
    if (status == 'InActive') filter.isActive = false

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]

    }

    const total = await userModel.countDocuments(filter)
    const users = await userModel
      .find(filter)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .populate('role')


    return {
      users,
      totalPages: Math.ceil( total / limit),
      currentPage: page,
      total
    }

  } catch (error) {
    throw (error)
  }

}

const getAllRoles = async (userId) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    }

    const roles = roleModel.find()
    return roles
  } catch (error) {
    throw error
  }

}

const logout = async (userId, reqHeader) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!')
    }

    await userSessionModel.deleteMany({
      userId : existUser._id,
      deviceId: reqHeader
    })
  } catch (error) {
    throw (error)
  }
}

const get2FaQrCode = async (reqBody) => {
  try {
    const existUser = await userModel.findOne({ _id: reqBody })
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    let twoFactorSecretKeyValue = null
    const twoFactorSecretKey = await twoFASecretKeyModel.findOne({ userId: existUser._id })
    if (!twoFactorSecretKey) {
      const newTwoFactorSecretKey = await twoFASecretKeyModel.create({
        userId: existUser._id,
        value: authenticator.generateSecret()
      })

      twoFactorSecretKeyValue = newTwoFactorSecretKey.value
    } else {
      twoFactorSecretKeyValue = twoFactorSecretKey.value
    }

    //Tạo OTP token
    const otpAuthToken = authenticator.keyuri(
      existUser.username,
      SERVICE_NAME,
      twoFactorSecretKeyValue
    )

    //Tạo ảnh QR Code từ OTP token để gửi về cho client
    const QRCodeImageUrl = await Qrcode.toDataURL(otpAuthToken)

    return QRCodeImageUrl

  } catch (error) {
    throw (error)
  }
}

const setup2FA = async (userId, reqOtpToken, reqHeader) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    const twoFactorSecretKey = await twoFASecretKeyModel.findOne({ userId: existUser._id })
    if (!twoFactorSecretKey) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Two Factor Secret Key not found!')
    }

    const clientOtpToken = reqOtpToken
    if (!clientOtpToken) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'client OTP token not found!' )
    }
    const isValid = authenticator.verify({
      token: clientOtpToken,
      secret: twoFactorSecretKey.value
    })
    if (!isValid) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid OTP token!')
    }

    const updatedUser = await userModel.findOneAndUpdate(
      { _id: existUser._id },
      { $set: { require2FA: true } },
      { new: true }
    )

    const updatedUserSession = await userSessionModel.findOneAndUpdate(
      { userId: existUser._id, deviceId: reqHeader },
      { $set: { is2FAVerified: true } },
      { new: true }
    )

    return {
      ...pickUser(updatedUser),
      is2FAVerified: updatedUserSession.is2FAVerified,
      lastLogin: updatedUserSession.lastLogin
    }

  } catch (error) {
    throw (error)
  }

}

const verify2FA = async (userId, reqOtpToken, reqHeader) => {
  try {
    const existUser = await userModel.findOne({ _id: userId })
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    const twoFactorSecretKey = await twoFASecretKeyModel.findOne({ userId: existUser._id })
    if (!twoFactorSecretKey) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Two Factor Secret Key not found!')
    }

    const clientOtpToken = reqOtpToken
    if (!clientOtpToken) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'client OTP token not found!' )
    }
    const isValid = authenticator.verify({
      token: clientOtpToken,
      secret: twoFactorSecretKey.value
    })
    if (!isValid) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Invalid OTP token!')
    }

    const updatedUserSession = await userSessionModel.findOneAndUpdate(
      { userId: existUser._id, deviceId: reqHeader },
      { $set: { is2FAVerified: true } },
      { new: true }
    )

    return {
      ...pickUser(existUser),
      is2FAVerified: updatedUserSession.is2FAVerified,
      lastLogin: updatedUserSession.lastLogin
    }
  } catch (error) {
    throw (error)
  }
}

const forgotPassword = async (email) => {
  try {
    const existUser = await userModel.findOne({ email })
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex')

    existUser.resetPasswordToken = hashedToken
    existUser.resetPasswordExpire = Date.now() + 15 * 60 * 1000 // 15 phút
    const user = await existUser.save()

    const to = user.email
    const toName = user.username
    const subject = 'Reset Password'
    const verificationLink = `${WEBSITE_DOMAIN}/reset-password?token=${resetToken}`

    const templateId = MAILER_SEND_TEMPLATE_IDS.REGISER_ACCOUNT

    const personalizationData = [
      {
        email: to,
        data: {
          name: 'ChaoBanh',
          account_name: toName,
          verification_link: verificationLink
        }
      }
    ]

    await MailerSendProvider.sendEmail({
      to,
      toName,
      subject,
      templateId,
      personalizationData
    })

    return user

  } catch (error) {
    throw error
  }
}

const resetPassword = async (token, newPassword) => {
  // Hash token để so khớp với DB
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  const existUser = await userModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  })
  if (!existUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
  }

  // Cập nhật mật khẩu
  const salt = await bcryptjs.genSalt(10)
  existUser.password = await bcryptjs.hash(newPassword, salt)

  // Xóa token reset
  existUser.resetPasswordToken = undefined
  existUser.resetPasswordExpire = undefined
  const user = await existUser.save()

  return user
}

export const userService = {
  createNew,
  verifyAccount,
  login,
  getUser,
  getAllUsers,
  getAllRoles,
  logout,
  refreshToken,
  update,
  get2FaQrCode,
  setup2FA,
  verify2FA,
  forgotPassword,
  resetPassword
}