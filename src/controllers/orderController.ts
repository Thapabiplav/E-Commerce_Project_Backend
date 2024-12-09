import { Response } from "express";
import { authData } from "../middleware/authMiddleware";
import { OrderData, PaymentMethod } from "../types/orderTypes";
import Order from "../database/models/orderModel";
import Payment from "../database/models/Payment";
import OrderDetail from "../database/models/orderDetailsModel";

class OrderController{
  async createOrder(req:authData,res:Response):Promise<void>{
    const userId=req.user?.id
    const{phoneNumber,shippingAddress,totalAmount,paymentDetails,items}:OrderData=req.body // paymentDetails object ho  items array
    if(!phoneNumber || !shippingAddress || !totalAmount || !paymentDetails || !paymentDetails.paymentMethod || items.length === 0){  // array ma ! check garna paudeena truthly value return garxa teslai .length property
      res.status(404).json({
        Message:'please provide phoneNumber,shippingAddress,totalAmount,paymentDetails and items'
      })
      return
    }

  //respective table ma halnu paryo

  const orderData=await Order.create({
    phoneNumber,
    shippingAddress,
    totalAmount,
    userId
  })

  await Payment.create({
    paymentMethod:paymentDetails.paymentMethod
  })

  for(var i=0;i<items.length;i++){
    await OrderDetail.create({
      quantity:items[i].quantity,
      productId:items[i].productId,
      orderId:orderData.id   //yo id mathi ko object bata lekhko kinki order garda ko id ho
    })
  }

  if(paymentDetails.paymentMethod === PaymentMethod.Khalti){
    // khalti integration

  }
  else{
    res.status(200).json({
      Message:"Order placed Successfully"
    })
  }
  }
}

export default new OrderController