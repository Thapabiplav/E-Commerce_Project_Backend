 import express, { Router } from 'express'
 import multer from 'multer'
import productController from '../controllers/productController'
import authMiddleware, { Roles } from '../middleware/authMiddleware'
import { storage } from '../middleware/multerMiddleware'
import errorHandler from '../services/catchAsyncError'
 
const upload=multer({storage:storage})
 const router:Router=express.Router()
 router.route('/product').post( authMiddleware.isAuthenticated, authMiddleware.restrictedTo(Roles.Admin), upload.single('image'),productController.addProduct).get(errorHandler(productController.getAllProduct))

 router.route('/product/:id').get(errorHandler(productController.getSingleProduct)).delete(authMiddleware.isAuthenticated,authMiddleware.restrictedTo(Roles.Admin),productController.deleteProduct)

 export default router