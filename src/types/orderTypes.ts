export interface OrderData{
  phoneNumber:string,
  shippingAddress:string,
  totalAmount:number,
  paymentDetails:{
    paymentMethod:PaymentMethod
    paymentStatus?:PaymentStatus,
    pidx?:string
  }
  items:OrderDetails[]  // array of orderDetails ko objects
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