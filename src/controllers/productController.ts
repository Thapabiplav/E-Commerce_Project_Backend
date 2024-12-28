import  {Request,Response} from 'express'
import Product from '../database/models/productModel'
import User from '../database/models/userModel'
import Category from '../database/models/categoryModel'
import { authData } from '../middleware/authMiddleware'


class ProductController{
  async addProduct(req:authData,res:Response):Promise<void>{
    const userId=req.user?.id
    const {productName,productDescription,productPrice,productTotalStockQty,categoryId}=req.body
    let fileName
    if(req.file){
      fileName=req.file?.filename
    }
    else{
      fileName='https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fheadphones&psig=AOvVaw2M07YnVgxE6NZyH_XNNpmP&ust=1733495100332000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPjpkvLqkIoDFQAAAAAdAAAAABAE'
    }
    if(!productName || !productDescription || !productPrice || !productTotalStockQty || !categoryId){
      res.status(401).json({
        message:"Please provide productName,productDescription,productPrice,productTotalStockQty,categoryId"
      })
      return
    }  
    await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStockQty,
      productImageUrl:fileName,
      userId:userId,
      categoryId:categoryId
      
    })
    res.status(203).json({
      message:"Product added successfully"
    })
  }

  async getAllProduct(req:Request,res:Response):Promise <void>{
    const data= await Product.findAll({
      include:[
        {
          model:User,
          attributes:['email','username']
        },
        {
          model:Category,
          attributes:['categoryName']
        }
      ]
    })
    res.status(200).json({
      message:"Products fetched successfully",
      data
    })
  }

  async getSingleProduct(req:Request,res:Response):Promise <void>{
    const id=req.params.id  
    const data= await Product.findOne({
      where:{
        id:id
      },
      include:[
        {
          model:User,
        attributes:['id','username','email']
      },
      {
        model:Category,
        attributes:['id','categoryName']
      }
      ]
       
    })
    if(!data){
      res.status(404).json({
        message:"No product with that id"
      })
    }
    else{
      res.status(200).json({
        message:"Product fetched Successfully",
        data
      })
    }

  }

  async deleteProduct(req:Request,res:Response):Promise<void>{
    const {id}=req.params 
    const data= await Product.findAll({
      where:{
        id:id,
      }
    })
    if(data.length>0){
      await Product.destroy({
        where:{
          id:id
        }
      })
      res.status(200).json({
        message:'Product delete successfully'
      })
    }
    else{
      res.status(404).json({
        message:"No product with that id"
      })
    }
  }
}

export default new ProductController