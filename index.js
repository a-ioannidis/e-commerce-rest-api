import createServer from "./app.js";
//acquire env variables
import dotenv from 'dotenv';

dotenv.config()

const server = createServer();
const port = process.env.PORT;

server.listen(port, () => {
    console.log(`E-Commerce REST API listening @ http://localhost:${port}`)
  })