import { type Request, type Response, type NextFunction } from 'express'
import { createProductValidation } from '../validations/product.validation'
import { logger } from '../utils/logger'
import { addProductToDB, getProductFromDB } from '../services/product.service'
import { v4 as uuidv4 } from 'uuid'
import type ProductType from '../types/product.type'

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
  const products: any = await getProductFromDB()
  const {
    params: { name }
  } = req

  if (name) {
    const filterProduct = products.filter((product: ProductType) => {
      if (product.name === name) {
        return product
      }
    })
    if (filterProduct.length === 0) {
      logger.info('Data not found')
      return res.status(404).send({ status: false, statusCode: 404, data: {} })
    }
    logger.info('Success get filtered product data')
    return res.status(200).send({ status: true, statuscode: 200, data: filterProduct[0] })
  }

  logger.info('Success get product data')
  return res.status(200).send({ status: true, statuscode: 200, data: products })
}
