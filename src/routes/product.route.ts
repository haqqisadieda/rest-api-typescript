import { Router } from 'express'
import { createProduct, getProducts } from '../controllers/product.controller'

export const ProductRouter: Router = Router()

ProductRouter.get('/', getProducts)
ProductRouter.get('/:id', getProducts)
ProductRouter.post('/', createProduct)
