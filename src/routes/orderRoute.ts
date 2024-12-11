import express,{Router} from 'express'
import authMiddleware, { Roles } from '../middleware/authMiddleware'
import errorHandler from '../services/catchAsyncError'
import orderController from '../controllers/orderController'


const router:Router=express.Router()
router.route('/customer/').post(authMiddleware.isAuthenticated,errorHandler(orderController.createOrder)).get(authMiddleware.isAuthenticated,errorHandler(orderController.fetchMyOrder))

router.route('/verify').post(authMiddleware.isAuthenticated,errorHandler(orderController.verifyTransaction)) //remaining

router.route('/customer/:id').patch(authMiddleware.isAuthenticated,authMiddleware.restrictedTo(Roles.Customer), errorHandler(orderController.cancelOrder)).get(authMiddleware.isAuthenticated, errorHandler(orderController.fetchOrderDetails))

router.route('/admin/payment/:id').patch(authMiddleware.isAuthenticated,authMiddleware.restrictedTo(Roles.Admin),errorHandler(orderController.changePaymentStatus))

router.route('/admin/:id').patch(authMiddleware.isAuthenticated,authMiddleware.restrictedTo(Roles.Admin),errorHandler(orderController.changeOrderStatus)).delete(authMiddleware.isAuthenticated,authMiddleware.restrictedTo(Roles.Admin),errorHandler(orderController.deleteOrder))



export default router