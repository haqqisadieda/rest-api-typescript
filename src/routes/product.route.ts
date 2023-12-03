import { Router } from 'express'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../controllers/product.controller'
import { requireAdmin } from '../middleware/auth'

export const ProductRouter: Router = Router()

ProductRouter.get('/', getProducts)
ProductRouter.get('/:id', getProducts)
ProductRouter.post('/', requireAdmin, createProduct)
ProductRouter.put('/:id', updateProduct)
ProductRouter.delete('/:id', deleteProduct)
