import productRouter from './routes/product.js';
import userRouter from './routes/user.js';
import cartRouter from './routes/cart.js';
import orderRouter from './routes/order.js';
import express from "express";
import session from 'express-session';


const createServer = () => {
  const app = express();
  const api = express.Router();
  
  app.use(
    session({
      name: 'sid',
      saveUninitialized: false,
      resave: false,
      secret:'secret',
      cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: true
      }
    }))



  // routes
  api.use('/user', userRouter);
  api.use('/products', productRouter);
  api.use('/cart', cartRouter);
  api.use('/order', orderRouter);
  

  // Is a method inbuilt in express to recognize the incoming Request Object as a JSON Object
  app.use(express.json());
  // add /api to all routes
  app.use('/api', api);

  return app;
}


export default createServer;




