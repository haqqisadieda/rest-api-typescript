import { type Request, type Response, type NextFunction, Router } from 'express'
import { logger } from '../utils/logger'
import { createProductValidation } from '../validation/product.validation'

export const ProductRouter: Router = Router()

ProductRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  logger.info('Success get product data')
  return res.status(200).send({ status: true, statusCode: 200, data: [{ name: 'Sepatu Sport', price: 500000 }] })
})

ProductRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = createProductValidation(req.body)
  if (error) {
    logger.error('ERR: Product-Create = ' + error.details[0].message)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message, data: {} })
  }
  logger.info('Success add new product')
  res.status(200).send({ status: true, statusCode: 200, message: 'Add product success', data: value })
})
