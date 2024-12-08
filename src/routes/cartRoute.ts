import express, { Router } from "express";
import authMiddleware, { Roles } from "../middleware/authMiddleware";
import errorHandler from "../services/catchAsyncError";
import cartController from "../controllers/cartController";
import { error } from "console";

const router = express.Router();

router
  .route("/cart")
  .post(authMiddleware.isAuthenticated, errorHandler(cartController.addToCart))
  .get(authMiddleware.isAuthenticated, errorHandler(cartController.getMyCarts));

router
  .route("/cart/:productId")
  .patch(
    authMiddleware.isAuthenticated,
    errorHandler(cartController.updateCarts)
  )
  .delete(
    authMiddleware.isAuthenticated,
    errorHandler(cartController.deleteMyCarts)
  );

export default router;
