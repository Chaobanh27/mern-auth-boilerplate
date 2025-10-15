import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import { userService } from '~/services/userService'
import ApiError from '~/utils/ApiError'


const createNew = async (req, res, next) => {
  try {
    const newUser = await userService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(newUser)
  } catch (error) { next(error) }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {

    const reqHeader = req.headers['user-agent']
    const reqBody = req.body
    const result = await userService.login(reqBody, reqHeader)

    if (req.body.rememberMe == false) {
      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      })
      res.status(StatusCodes.OK).json(result)

    }


    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const getUser = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const reqHeader = req.headers['user-agent']
    const result = await userService.getUser(userId, reqHeader)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const reqQuery = req.query
    const result = await userService.getAllUsers(userId, reqQuery)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }

}

const getAllRoles = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await userService.getAllRoles(userId)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const reqHeader = req.headers['user-agent']
    await userService.logout(userId, reqHeader)
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ loggedOut: true })
  } catch (error) { next(error) }
}

const refreshToken = async (req, res, next) => {
  try {
    const result = await userService.refreshToken(req.cookies?.refreshToken)

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(new ApiError(StatusCodes.FORBIDDEN, 'Please Sign In! '))
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const userAvatarFile = req.file
    const updatedUser = await userService.update(userId, req.body, userAvatarFile)
    res.status(StatusCodes.OK).json(updatedUser)
  } catch (error) { next(error) }
}

const get2FaQrCode = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const result = await userService.get2FaQrCode(userId)
    res.status(StatusCodes.OK).json({ qrcode: result })
  } catch (error) {
    next(error)
  }
}

const setup2FA = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const reqOtpToken = req.body.otpToken
    const reqHeader = req.headers['user-agent']
    const result = await userService.setup2FA(userId, reqOtpToken, reqHeader)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }

}

const verify2FA = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const reqOtpToken = req.body.otpToken
    const reqHeader = req.headers['user-agent']
    const result = await userService.verify2FA(userId, reqOtpToken, reqHeader)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const result = await userService.forgotPassword(email)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body
    const result = await userService.resetPassword(token, newPassword)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const userController = {
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