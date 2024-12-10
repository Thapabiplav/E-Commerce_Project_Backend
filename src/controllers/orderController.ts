import { Response } from "express";
import axios from 'axios'
import { authData } from "../middleware/authMiddleware";
import { KhaltiResponse, OrderData, orderStatus, PaymentMethod, TransactionStatus, TransactionVerificationResponse } from "../types/orderTypes";
import Order from "../database/models/orderModel";
import Payment from "../database/models/Payment";
import OrderDetail from "../database/models/orderDetailsModel";
import Product from "../database/models/productModel";

class OrderController{
  async createOrder(req:authData,res:Response):Promise<void>{
    const userId=req.user?.id
    const{phoneNumber,shippingAddress,totalAmount,paymentDetails,items}:OrderData=req.body
    if(!phoneNumber || !shippingAddress || !totalAmount || !paymentDetails || !paymentDetails.paymentMethod || items.length === 0){  
      res.status(404).json({
        Message:'please provide phoneNumber,shippingAddress,totalAmount,paymentDetails and items'
      })
      return
    }

 const paymentData= await Payment.create({
    paymentMethod:paymentDetails.paymentMethod
  })

  const orderData=await Order.create({
    phoneNumber,
    shippingAddress,
    totalAmount,
    userId,
    paymentId:paymentData.id
  })

 

  for(var i=0;i<items.length;i++){
    await OrderDetail.create({
      quantity:items[i].quantity,
      productId:items[i].productId,
      orderId:orderData.id   
    })
  }

  if(paymentDetails.paymentMethod === PaymentMethod.Khalti){
    // khalti integration
    const data ={
      return_url:'http://localhost:4000/successs/', 
      purchase_order_id:orderData.id , 
      amount:totalAmount*100, 
      website_url:"http://localhost:4000",
      purchase_order_name:'orderName_'+'orderData.id'
    }
    const response = await axios.post('https://a.khalti.com/api/v2/epayment/initiate/',data,{
      headers:{
        'Authorization':'key 935693eb641a40b3b4937535777bc285'
      }
    })
    const khaltiResponse:KhaltiResponse=response.data
    paymentData.pidx=khaltiResponse.pidx
    paymentData.save()
    res.status(200).json({
      Message:'order placed Successfully',
      url:khaltiResponse.payment_url
    })

  }
  else{
    res.status(200).json({
      Message:"Order placed Successfully"
    })
  }
  }

  async verifyTransaction(req:authData,res:Response):Promise<void>{
    const {pidx}=req.body
    const userId=req.user?.id
    if(!pidx){
      res.status(404).json({
        message:'please provide pidx'
      })
      return
    }

    const response =await axios.post('https://a.khalti.com/api/v2/epayment/lookup/', {pidx},{
      headers:{
        'Authorization':'key 935693eb641a40b3b4937535777bc285'
      }
    })
    const data:TransactionVerificationResponse=response.data
    if(data.status === TransactionStatus.Completed){
      await Payment.update({paymentStatus:'paid'},{
        where:{
          pidx
        }
      })
      res.status(200).json({
        message:"payment verified successfully"
      })
    }
    else{
      res.status(200).json({
        message:'Payment not Verified'
      })
    }

  }

  // customer side starts

  async fetchMyOrder(req:authData,res:Response):Promise<void>{
    const userId=req.user?.id
    const order= await Order.findAll({
      where:{
        userId
      },
      include:[
        {
          model:Payment
        }
      ]
    })
    if(order.length > 0){
      res.status(200).json({
      message:'order fetched successfully',
      data:order
      })
    }
    else{
      res.status(404).json({
        message:"you haven't order anything",
        data:[]
      })
    }
  }

  async fetchOrderDetails(req:authData,res:Response):Promise<void>{
    const orderId=req.params
    const orderDetails= await OrderDetail.findAll({
      where:{
        orderId
      },
      include:[{
        model:Product
      }]
    })
    if(orderDetails.length>0){
      res.status(200).json({
        message:"orderDetails fetched successfully",
        data:orderDetails
      })
    }
    else{
      res.status(404).json({
        message:"no any orderDetails of that id",
        data:[]
      })
    }
  }

  async cancelOrder(req:authData,res:Response):Promise<void>{
    const userId=req.user?.id
    const orderId=req.params
    const order:any= await Order.findAll({
      where:{
        userId,
        orderId
      }
    })
    if(order?.orderStatus === orderStatus.Ontheway || order.orderStatus === orderStatus.Preparation){
      res.status(200).json({
        message:"you cannot cancelled order when it is ontheway or preparation"
      })
      return
    }
    await Order.update({orderStatus:orderStatus.Cancelled},{
      where:{
        id:orderId
      }
    })
    res.status(200).json({
      message:'order cancelled successfully'
    })
  }
}

//customer side ends

export default new OrderController
