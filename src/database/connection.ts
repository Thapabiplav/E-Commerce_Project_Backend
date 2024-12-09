import { Sequelize } from "sequelize-typescript";
import User from "./models/userModel";
import Product from "./models/productModel";
import Category from "./models/categoryModel";
import Cart from "./models/cartModel";
import Order from "./models/orderModel";
import OrderDetail from "./models/orderDetailsModel";
import Payment from "./models/Payment";

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  dialect: "mysql",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  models: [__dirname + "/models"],
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connected successfully");
  })
  .catch((error) => {
    console.log("error", error);
  });


sequelize.sync({ force:false}).then(() => {
  console.log("migrated successfully");
});

 // relationship
 User.hasMany(Product,{foreignKey:'userId'})
 Product.belongsTo(User,{foreignKey:'userId'})

Product.belongsTo(Category,{foreignKey:'categoryId'})
Category.hasOne(Product,{foreignKey:'categoryId'})

// Cart relationship
User.hasMany(Cart,{foreignKey:'userId'}),
Cart.belongsTo(User,{foreignKey:'userId'})

Product.hasMany(Cart,{foreignKey:'productId'})
Cart.belongsTo(Product,{foreignKey:'productId'})

// Table relationship

Order.hasMany(OrderDetail,{foreignKey:'orderId'})
OrderDetail.belongsTo(Order,{foreignKey:'orderId'})

Product.hasMany(OrderDetail,{foreignKey:'productId'})
OrderDetail.belongsTo(Product,{foreignKey:'productId'})

Payment.hasMany(Order,{foreignKey:'paymentId'})
Order.belongsTo(Payment,{foreignKey:'paymentId'})

User.hasMany(Order,{foreignKey:'userId'})
Order.belongsTo(User,{foreignKey:'userId'})

export default sequelize;
