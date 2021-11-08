import productRouter from './routes/product.js';
import loginRouter from './routes/login.js';
import registerRouter from './routes/register.js';
import express from "express";


const createServer = () => {
  const app = express();
  const api = express.Router();
  // routes
  api.use('/products', productRouter);
  api.use('/login', loginRouter);
  api.use('/register', registerRouter);

  // Is a method inbuilt in express to recognize the incoming Request Object as a JSON Object
  app.use(express.json());
  // add /api to all routes
  app.use('/api', api);

  return app;
}


export default createServer;




