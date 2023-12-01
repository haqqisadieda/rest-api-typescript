import { Router } from 'express'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/product.controller'

export const ProductRouter: Router = Router()

ProductRouter.get('/', getProducts)
ProductRouter.get('/:id', getProducts)
ProductRouter.post('/', createProduct)
ProductRouter.put('/:id', updateProduct)
ProductRouter.delete('/:id', deleteProduct)
