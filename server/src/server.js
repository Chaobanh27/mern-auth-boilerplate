/* eslint-disable no-console */
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { connectDB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { errorHandlingMiddleware } from '~/middlewares/errorHandlingMiddleware'
import { corsOptions } from '~/config/cors'
import { API_V1 } from '~/routes/v1/index'
import cookieParser from 'cookie-parser'
import swaggerDocs from '~/config/swagger'
import morgan from 'morgan'
import { logger } from '~/config/logger'
import seedDB from '~/config/seedDB'

const startServer = () => {
  const app = express()

  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })
  app.use(helmet())

  app.use(morgan('tiny'))

  app.use(cookieParser())

  app.use(cors(corsOptions))

  app.use(express.json())

  app.use('/v1', API_V1)

  app.use(errorHandlingMiddleware)

  swaggerDocs(app)

  if (env.BUILD_MODE === 'production') {
    app.listen(process.env.PORT, () => {
      logger.info(`Production: Hi ${env.AUTHOR}, Back-end app is running successfully at Port: ${process.env.PORT}`)
    })
  } else {
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      logger.info(`Local DEV: Hi ${env.AUTHOR}, Back-end Server is running successfully at Host: ${env.LOCAL_DEV_APP_HOST} and Port: ${env.LOCAL_DEV_APP_PORT}`)
    })
  }
}

(async () => {
  try {
    logger.info('Connecting to MongoDB CLoud Atlas...')
    await connectDB()
    logger.info('Connected to MongoDB Cloud Atlas')
    await seedDB()
    logger.info('DataBase has beed seed')
    startServer()
  }
  catch (error) {
    logger.error(error)
    process.exit(0)
  }
})()
