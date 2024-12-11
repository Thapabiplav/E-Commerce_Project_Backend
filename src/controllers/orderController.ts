import { Response,Request } from "express";
import axios from 'axios'
import { authData } from "../middleware/authMiddleware";
import { KhaltiResponse, OrderData,  OrderStatus,  PaymentMethod, PaymentStatus, TransactionStatus, TransactionVerificationResponse } from "../types/orderTypes";
import Order from "../database/models/orderModel";
import Payment from "../database/models/Payment";
import OrderDetail from "../database/models/orderDetailsModel";
import Product from "../database/models/productModel";

class ExtendedOrder extends Order{
  declare paymentId:string |null
}

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
    const orderId=req.params.id
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
    const userId = req.user?.id 
    const orderId = req.params.id 
    const order:any = await Order.findAll({
        where : {
            userId, 
            id : orderId
        }
    })
    if(order?.orderStatus === OrderStatus.Ontheway || order?.orderStatus === OrderStatus.Preparation ){
         res.status(200).json({
            message : "You cannot cancel order when it is in ontheway or prepared"
        })
        return
    }
    await Order.update({
      orderStatus:OrderStatus.Cancelled
    },{
      where:{
        id:orderId
      }
    })
    
    res.status(200).json({
        message : "Order cancelled successfully"
    })
  }

  //customer side ends

//admin side
async changeOrderStatus(req:Request,res:Response):Promise<void>{
  const orderId=req.params.id
  const orderStatus:OrderStatus=req.body
  await Order.update({
    orderStatus:orderStatus
  },{
    where:{
      id:orderId
    }
  })
  res.status(200).json({
    message:'Order status updated successfully'
  })
}

async changePaymentStatus (req:Request,res:Response):Promise<void>{
  const orderId=req.params.id
  const paymentStatus:PaymentStatus=req.body.paymentStatus
  const order= await Order.findByPk(orderId)
  const extendedOrder:ExtendedOrder= order as ExtendedOrder
  await Payment.update({
    paymentStatus:paymentStatus
  },{
    where:{
      id:extendedOrder.paymentId  //body ma orderId ako hunxa tyo order table ma find garne rw payment Id leyera update garne paymentstatus
    }
  })
  res.status(200).json({
    message:`Payment Status of ${orderId} updated successfully to ${paymentStatus}`
  })
}

async deleteOrder (req:Request,res:Response):Promise<void>{
  const orderId=req.params.id
  const order= await Order.findByPk(orderId)
  const extendedOrder:ExtendedOrder= order as ExtendedOrder
  if (order){

    await OrderDetail.destroy({
      where:{
        orderId:orderId
      }
    })
  
    await Payment.destroy({
      where:{
        id:extendedOrder.paymentId
      }

    })

    await Order.destroy({
      where:{
        id:orderId
      }
    })
    
    res.status(200).json({
      message:'Order deleted successfully'
    })
  }
  else{
    res.status(404).json({
      message:'No order with that id found'
    })
  }
  
}
}

export default new OrderController
