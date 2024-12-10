export interface OrderData{
  phoneNumber:string,
  shippingAddress:string,
  totalAmount:number,
  paymentDetails:{
    paymentMethod:PaymentMethod
    paymentStatus?:PaymentStatus,
    pidx?:string
  }
  items:OrderDetails[]  
}

export interface OrderDetails{
  quantity:number,
  productId:string
}

export enum PaymentMethod{
  Cod="cod",
  Esewa="esewa",
  Khalti='khalti'
}

enum PaymentStatus{
  Paid='paid',
  Unpaid='unpaid'
}

export interface KhaltiResponse{
  pidx:string,
  payment_url:string,
  expires_at:Date | string,
  expires_in:number,
  user_fee:number
}

export interface TransactionVerificationResponse{
  pidx:string,
   total_amount:number,
   status:TransactionStatus,
   transaction_id:number,
   fee:number,
   refunded:boolean

}

 export enum TransactionStatus{ 
  Completed='Completed',
  Refunded='Refunded',
  Pending='Pending',
  Initiated='Initiated'
}

export enum orderStatus{
  Pending='pending',
  Cancelled='cancelled',
  Ontheway='ontheway',
  Preparation='preparation',
  Delivered='delivered'
}