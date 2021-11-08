import productRouter from './routes/product.js';
import express from "express";


const createServer = () => {
  const app = express();
  const api = express.Router();

  api.use('/products', productRouter);
  app.use(express.json());
  app.use('/api', api);

  return app;
}


export default createServer;




