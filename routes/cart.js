import { Router } from "express";
import  pool  from "../db.js";

const cartRouter = Router();

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/api/user')
    } else {
        next()
    }
}  

// // get cart
cartRouter.get('/', redirectLogin, async(req, res, next) => {
    try {
        const cartId = await pool.query('SELECT * FROM cart WHERE customer_id=$1', [req.session.userId])
        res.status(200).json(cartId.rows[0])
    } catch (err) {
        next(err);
    }
})


// add product to cart
cartRouter.post('/', redirectLogin, async(req, res, next) => {
    try {
        const product = {
            id: req.body.id,
            quantity: req.body.quantity || 1
        }
        const cartId = await pool.query('SELECT * FROM cart WHERE customer_id=$1', [req.session.userId])
        const checkIsOnCart = await pool.query ('SELECT * FROM cart_products WHERE product_id=$1', [product.id])
        if (checkIsOnCart.rows[0] === undefined) {
            const addToCart = await pool.query('INSERT INTO cart_products (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
            [cartId.rows[0]['id'], product.id, product.quantity])
            
        } else {
            const updateCart = await pool.query('UPDATE cart_products SET quantity=$1',[product.quantity + checkIsOnCart.rows[0]['quantity']])
        }
        const product_price = await pool.query('SELECT price FROM products WHERE id=$1', [product.id])
        const product_total_price = product.quantity * product_price.rows[0]['price']
        const total_cart_price = await pool.query('SELECT total_cost FROM cart WHERE customer_id=$1', [req.session.userId])
        const total_price = total_cart_price.rows[0]['total_cost'] + product_total_price
        const updatePrice = await pool.query('UPDATE cart SET total_cost=$1 WHERE customer_id=$2', [total_price, req.session.userId])
        res.status(200).json(`Cart Updated`)
    } catch (err) {
        next(err);
    }
})

// remove product from cart
cartRouter.delete('/', redirectLogin, async(req, res, next) => {
    try {
        const product = {
            id: req.body.id
        }
        const cartId = await pool.query('SELECT id FROM cart WHERE customer_id=$1', [req.session.userId])
        const quantity = await pool.query('SELECT quantity FROM cart_products WHERE product_id=$1', [product.id])
        const removeFromCart = await pool.query('DELETE FROM cart_products WHERE product_id=$1', [product.id])
        const product_price = await pool.query('SELECT price FROM products WHERE id=$1', [product.id])
        const product_total_price = quantity.rows[0]['quantity'] * product_price.rows[0]['price']
        const total_cart_price = await pool.query('SELECT total_cost FROM cart WHERE customer_id=$1', [req.session.userId])
        const total_price = total_cart_price.rows[0]['total_cost'] - product_total_price
        const updatePrice = await pool.query('UPDATE cart SET total_cost=$1 WHERE customer_id=$2', [total_price, req.session.userId])
        res.status(202).json(`Cart Updated`)
    } catch (err) {
        next(err);
    }
})

// checkout

cartRouter.post('/checkout', redirectLogin, async(req, res, next) => {
    try {
        const total_cost = await pool.query('SELECT total_cost, id FROM cart WHERE customer_id=$1',[req.session.userId])
        const checkout = await pool.query('INSERT INTO orders (customer_id, order_date, total_cost) VALUES ($1, now(), $2)', [req.session.userId, total_cost.rows[0]['total_cost']])
        const order_id = await pool.query('SELECT id from orders WHERE customer_id=$1 ORDER BY id DESC LIMIT 1', [req.session.userId])
        const updatePrice = await pool.query('UPDATE cart SET total_cost=$1', [0])
        const orderProducts = await pool.query('SELECT * FROM cart_products WHERE cart_id=$1', [total_cost.rows[0]['id']])
        orderProducts.rows.forEach(element => {
            pool.query('INSERT INTO orders_products (order_id, product_id, quantity) VALUES ($1, $2, $3)', 
            [order_id.rows[0]['id'], element['product_id'], element['quantity']])
            
        });
        const emptyCart = await pool.query('DELETE FROM cart_products WHERE cart_id=$1',[total_cost.rows[0]['id']])
        res.status(200).json(`Checkout`)
    } catch (err) {
        next(err)
    }
})
export default cartRouter;