import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from '~/routes/v1/userRoute'
import { logger } from '~/config/logger'

const Router = express.Router()
/**
 * @swagger
 * /status:
 *   get:
 *     summary: kiểm tra kết nối
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Thành công
 */
Router.get('/status', (req, res) => {
  logger.info('api v1 is ready to use')
  res.status(StatusCodes.OK).json({ message: 'api v1 is ready to use' })
})

Router.use('/users', userRoute)


export const API_V1 = Router