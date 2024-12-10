import { Response } from "express";
import axios from 'axios'
import { authData } from "../middleware/authMiddleware";
import { KhaltiResponse, OrderData, PaymentMethod } from "../types/orderTypes";
import Order from "../database/models/orderModel";
import Payment from "../database/models/Payment";
import OrderDetail from "../database/models/orderDetailsModel";

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
}

export default new OrderController