import { Router } from "express";
import  pool  from "../db.js";

const productRouter = Router();

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/api/user')
    } else {
        next()
    }
}  

// get all products

productRouter.get('/', redirectLogin, async (req, res, next) => {
    try {
        const allProcucts = await pool.query('SELECT * FROM products')
        res.status(200).json(allProcucts.rows)
    } catch(err) {
        next(err);
}
})

// get products by id
productRouter.get('/:id', redirectLogin, async (req, res, next) => {

    try {
        const product = {
            id: req.params.id
        }
        const Isproduct = await pool.query('SELECT name, price, image FROM products WHERE id=$1', [product.id])
        if (Isproduct.rows[0] === undefined) {
            throw new Error (`Product ${product.id} not exists`)
        }
        res.status(200).json(Isproduct.rows[0]);

    } catch(err) {
        next(err);
    }
})


// add product
productRouter.post('/', async(req, res, next) => {
    try {
        const product = {
            name: req.body.name,
            price: req.body.price,
            image:req.body.image
        }
        const checkIfExists = await pool.query('SELECT * FROM products WHERE name=$1',[product.name])
        if (checkIfExists.rows[0] === undefined) {
            const addProcuct = await pool.query('INSERT INTO products (name, price, image) VALUES ($1, $2, $3)',
            [product.name, product.price, product.image])
            res.status(200).json(`${product.name} added`)
        } else {
            throw new Error (`Product ${product.name} already exists`)
        }
    } catch (err) {
        next(err);
    }
})


//update product price

productRouter.put('/', async(req, res, next) => {
    try {
        const product = {
            name: req.body.name,
            price: req.body.price,
        }
        const updateProduct = await pool.query('SELECT * FROM products WHERE name=$1',[product.name])
         if (updateProduct.rows[0] !== undefined) {
            if (updateProduct.rows[0]['name'] === product.name){
                const addProcuct = await pool.query('UPDATE products set price=$1 WHERE id=$2',[product.price, updateProduct.rows[0]['id']])
                res.status(200).json(`${product.name} updated`)
            }
         } else {
            throw new Error (`${product.name} does not exists.`)
        }
    } catch (err) {
        next(err);
    }
})

// remove product
productRouter.delete('/', async(req, res, next) => {
    try {
        const product = {
            name: req.body.name
        }
        const removeProduct = await pool.query('SELECT * FROM products WHERE name=$1',[product.name])
         if (removeProduct.rows[0] !== undefined) {
            if (removeProduct.rows[0]['name'] === product.name){
                const addProcuct = await pool.query('DELETE FROM products WHERE id=$1',[removeProduct.rows[0]['id']])
                res.status(200).json(`${product.name} removed`)
            }
         } else {
            throw new Error (`${product.name} does not exists.`)
        }
    } catch (err) {
        next(err);
    }
})

export default productRouter;