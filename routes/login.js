import { Router } from "express";

// create Router
const loginRouter = Router();

loginRouter.get('/', (req, res) => {
    res.send(`Welcome to Login Page`)
    res.status(200).send();
})



export default loginRouter;