import { type Request, type Response, type NextFunction } from 'express'
import { createProductValidation } from '../validations/product.validation'
import { logger } from '../utils/logger'
import { addProductToDB, getProductById, getProductFromDB } from '../services/product.service'
import { v4 as uuidv4 } from 'uuid'

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  req.body.product_id = uuidv4()
  const { error, value } = createProductValidation(req.body)
  if (error) {
    const errorMessage: string = error.details[0].message
    logger.error(`ERR: Product - Create = ${errorMessage}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error.details[0].message })
  }
  try {
    await addProductToDB(value)
    logger.info('Success add new product')
    res.status(200).send({ status: true, statusCode: 200, message: 'Add product success' })
  } catch (error) {
    const errorMessage: any = error
    logger.error(`ERR: Product - Create = ${errorMessage}`)
    return res.status(422).send({ status: false, statusCode: 422, message: error })
  }
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const {
    params: { id }
  } = req

  if (id) {
    const product: any = await getProductById(id)
    if (product) {
      logger.info('Success get product data by id')
      return res.status(200).send({ status: true, statuscode: 200, data: product })
    } else {
      logger.info('Data not found')
      return res.status(404).send({ status: false, statuscode: 404, data: {} })
    }
  } else {
    const products: any = await getProductFromDB()
    logger.info('Success get product data')
    return res.status(200).send({ status: true, statuscode: 200, data: products })
  }
}
