import express, { type Application } from 'express'
import bodyParser from 'body-parser'
import deserializeToken from '../middleware/deserializedToken'
import { routes } from '../routes'
import cors from 'cors'

const createServer = (): Application => {
  const app: Application = express()

  // deserialize token
  app.use(deserializeToken)

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

  routes(app)

  return app
}

export default createServer
