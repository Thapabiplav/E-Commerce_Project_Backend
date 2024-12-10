import express,{Router} from 'express'
import authMiddleware, { Roles } from '../middleware/authMiddleware'
import errorHandler from '../services/catchAsyncError'
import orderController from '../controllers/orderController'


const router:Router=express.Router()
router.route('/order').post(authMiddleware.isAuthenticated,errorHandler(orderController.createOrder))
router.route('/verify').post(authMiddleware.isAuthenticated,errorHandler(orderController.verifyTransaction))
router.route('/request').get(authMiddleware.isAuthenticated,errorHandler(orderController.fetchMyOrder))
router.route('/:id').patch(authMiddleware.isAuthenticated,authMiddleware.restrictedTo(Roles.Customer), errorHandler(orderController.cancelOrder)).get(authMiddleware.isAuthenticated, errorHandler(orderController.fetchOrderDetails))



export default router