import Category from "../database/models/categoryModel";
import { Request, Response } from "express";

class CategoryController {
  categoryData = [
    {
      categoryName: "Electronics",
    },
    {
      categoryName: "Groceries",
    },
    {
      categoryName: "Food/Beverages",
    },
  ];
  async seedCategory(): Promise<void> {
    const data = await Category.findAll();
    if (data.length === 0) {
      await Category.bulkCreate(this.categoryData);
      console.log("Category data seeded successfully");
    } else {
      console.log("Category data already seeded");
    }
  }

  async addCategory(req: Request, res: Response): Promise<void> {
    const { categoryName } = req.body;
    if (!categoryName) {
      res.status(400).json({
        message: "please provide categoryName",
      });
      return;
    }

    await Category.create({
      categoryName
    });
    res.status(201).json({
      message: "Category Added Successfully",
    });
  }

  async getCategory(req: Request, res: Response): Promise<void> {
    const data = await Category.findAll();
    res.status(200).json({
      message: "Categories fetched",
      data,
    });
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data = await Category.findAll({
      where: {
        id,
      },
    });

    if (data.length === 0) {
      res.status(401).json({
        message: "No category with that id",
      });
    } else {
      await Category.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({
        message: "Category deleted successfully",
      });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { categoryName } = req.body;
    await Category.update(
      { categoryName },
      {
        where: {
          id,
        },
      }
    );
    res.status(200).json({
      message: "Category Updated",
    });
  }
}
export default new CategoryController();
