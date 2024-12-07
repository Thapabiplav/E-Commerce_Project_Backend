import express, { Router } from "express";
import authMiddleware, { Roles } from "../middleware/authMiddleware";
import categoryController from "../controllers/categoryController";
import errorHandler from "../services/catchAsyncError";

const router: Router = express.Router();
router
  .route("/category")
  .post(
    authMiddleware.isAuthenticated, authMiddleware.restrictedTo(Roles.Admin),
    categoryController.addCategory
  )
  .get(errorHandler(categoryController.getCategory));

router
  .route("/category/:id")
  .delete(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictedTo(Roles.Admin),
    categoryController.deleteCategory
  )
  .patch(
    authMiddleware.isAuthenticated,
    authMiddleware.restrictedTo(Roles.Admin),
    categoryController.updateCategory
  );

export default router;
