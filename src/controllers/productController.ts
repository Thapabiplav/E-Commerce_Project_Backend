import  {Request,Response} from 'express'
import Product from '../database/models/productModel'


class ProductController{
  async addProduct(req:Request,res:Response):Promise<void>{
    const {productName,productDescription,productPrice,productTotalStockQty}=req.body
    let fileName
    if(req.file){
      fileName=req.file?.filename
    }
    else{
      fileName='https://www.google.com/url?sa=i&url=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fheadphones&psig=AOvVaw2M07YnVgxE6NZyH_XNNpmP&ust=1733495100332000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCPjpkvLqkIoDFQAAAAAdAAAAABAE'
    }
    if(!productName || !productDescription || !productPrice || !productTotalStockQty){
      res.status(401).json({
        message:"Please provide productName,productDescription,productPrice,productTotalStockQty"
      })
      return
    }  
    await Product.create({
      productName,
      productDescription,
      productPrice,
      productTotalStockQty,
      productImageUrl:fileName
      
    })
    res.status(203).json({
      message:"Product added successfully"
    })
  }
}

export default new ProductController