import { Router } from "express";

const productRouter = Router();

productRouter.get('/:id', (req, res) => {
    res.send(`Hello products ${req.params.id}`)
    res.status(200).send();
})



export default productRouter;