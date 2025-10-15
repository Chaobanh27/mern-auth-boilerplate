
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment'
import { logger } from '~/config/logger'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'

const isAuthorized = async (req, res, next) => {
  const accessTokenFromCookie = req.cookies?.accessToken
  if (!accessTokenFromCookie) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)'))
    return
  }

  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessTokenFromCookie,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    )

    req.jwtDecoded = accessTokenDecoded
    next()
  } catch (error) {
    logger.error('Error from authMiddleware: ', error)
    if (error.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'))
      return
    }
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = { isAuthorized }