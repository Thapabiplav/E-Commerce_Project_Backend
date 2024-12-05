 import express, { Router } from 'express'
 import multer from 'multer'
import productController from '../controllers/productController'
import authMiddleware, { Roles } from '../middleware/authMiddleware'
import { storage } from '../middleware/multerMiddleware'
 
const upload=multer({storage:storage})
 const router:Router=express.Router()
 router.route('/product').post( authMiddleware.isAuthenticated, authMiddleware.restrictedTo(Roles.Admin), upload.single('image'),productController.addProduct)

 export default router