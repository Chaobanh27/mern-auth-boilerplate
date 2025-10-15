/* eslint-disable no-console */

import { StatusCodes } from 'http-status-codes'
import roleModel from '~/models/roleModel'

const isValidPermission = (requiredPermissions) => {
  return async (req, res, next) => {
    try {

      const userRole = req.jwtDecoded.role


      if (!userRole) {
        res.status(StatusCodes.FORBIDDEN).json({
          message: 'Your role is not allowed to access this API'
        })
        return
      }
      const fullUserRole = await roleModel.find({ name: userRole })


      if (!fullUserRole) {
        res.status(StatusCodes.FORBIDDEN).json({
          message: 'Your role does not exist in Database'
        })
        return
      }

      const hasPermission = requiredPermissions?.every(i => fullUserRole[0].permissions.includes(i))
      if (!hasPermission) {
        res.status(StatusCodes.FORBIDDEN).json({
          message: 'You do not have the permission to access this API'
        })
        return
      }
      next()
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Oops ! something went wrong' })
    }
  }
}

export const roleCheckingMiddleware = { isValidPermission }