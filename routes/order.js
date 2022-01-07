import { Router } from "express";
import  pool  from "../db.js";

const orderRouter = Router();

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.send(`Welcome to login page`)
    } else {
        next()
    }
}  

// get all orders by id
orderRouter.get('/', redirectLogin, async(req, res, next) => {
    try {
        const orders = await pool.query('SELECT DISTINCT \
        orders.id, products.name, orders_products.quantity, orders.order_date \
        FROM products INNER JOIN orders_products \
        ON products.id = orders_products.product_id \
        inner join orders ON orders.id=orders_products.order_id \
        WHERE orders.customer_id=$1', [req.session.userId])
        res.status(200).json(orders.rows)
    } catch(err) {
        next(err);
    }
})

export default orderRouter;