import express, { type Application } from 'express'
import { routes } from './routes'
import { logger } from './utils/logger'
import bodyParser from 'body-parser'
import cors from 'cors'

// connect to mongodb
import './utils/connectDB'

// deserialize token
import deserializeToken from './middleware/deserializedToken'

const app: Application = express()
const port: number = 4000

// body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// cors
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

// deserialize token
app.use(deserializeToken)

routes(app)

app.listen(port, () => {
  logger.info(`Server is listening on port ${port}`)
})
