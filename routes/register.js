import { Router } from "express";
// import { add } from "../db/index.js";
// create Router
const registerRouter = Router();

registerRouter.get('/', (req, res) => {
    res.send(`Register`)
    res.status(200).send();
})

registerRouter.post('/', (req, res) => {
    const user = {
        name: req.body.name,
        password: req.body.password,
        email: req.body.email 
    }
    add(user)
    res.status(200).send();
})


export default registerRouter;