import { logger } from './utils/logger'
import type { Application } from 'express'
import createServer from './utils/server'

// connect to mongodb
import './utils/connectDB'

const app: Application = createServer()
const port = 4000

app.listen(port, () => {
  logger.info(`Server is listening on port ${port}`)
})
