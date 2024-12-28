import { Request, Response } from "express";
import { authData } from "../middleware/authMiddleware";
import Cart from "../database/models/cartModel";
import Product from "../database/models/productModel";

class CartController {
  async addToCart(req: authData, res: Response): Promise<void> {
    const userId = req.user?.id;
    const { quantity, productId } = req.body;
    if (!quantity || !productId) {
      res.status(404).json({
        Message: "please provide quantity and productId",
      });
      
    }

    let cartItem = await Cart.findOne({
      where: {
        userId,
        productId,
      },
    });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        productId,
        userId,
        quantity,
      });
    }
    const data= await Cart.findAll({
      where:{
        userId
      }
    })
    const product= await Product.findByPk(productId)
      res.status(200).json({
        Message: "Added Successfully",
        data
      });
   
  }

  async getMyCarts(req: authData, res: Response): Promise<void> {
    const userId = req.user?.id;
    const cartItems = await Cart.findAll({
      where: {
        userId,
      },
      include: [
        {
          model: Product,
        },
      ],
    });
    if (cartItems.length === 0) {
      res.status(404).json({
        Message: "No Item in the cart",
      });
    } else {
      res.status(200).json({
        Message: "Items fetched successfully",
        data: cartItems,
      });
    }
  }

  async deleteMyCarts (req:authData,res:Response):Promise<void>{
    const userId=req.user?.id
    const {productId}=req.params
    const product= await Product.findByPk(productId)
    if(!product){
      res.status(404).json({
        Message:"No product with that id"
      })
      return
    }

      await Cart.destroy({
        where:{
          productId,
          userId
        }
      })
      res.status(200).json({
        Message:"Product of Cart deleted successfully"
      })
    }
    
    async updateCarts(req:authData,res:Response):Promise<void>{
      const userId=req.user?.id
      const {productId}=req.params
      const {quantity}=req.body
      if(!quantity){
        res.status(404).json({
          Message:"Please provide quantity"
        })
        return
      }

      const cartData= await Cart.findOne({
        where:{
          userId,
          productId
        }
      })
      if(cartData){
        cartData.quantity=quantity
        await cartData?.save()
        res.status(200).json({
          Message:"Product of cart updated successfully",
          data:cartData
        })
      }
      else{
        res.status(404).json({
          Message:"No productId of that userId"
        })
      }
      
    }
    

  }


export default new CartController();
