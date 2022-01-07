import { Router } from "express";
import  pool  from "../db.js";

// create Router
const userRouter = Router();

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect('/api/user')
    } else {
        next()
    }
}  

const redirectHome = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/api/user/home')
    } else {
        next()
    }
}  

userRouter.get('/', redirectHome, (req, res) => {
    res.send(`Welcome to login page`)
    // res.status(200).send();
})

userRouter.get('/home', redirectLogin, (req, res) => {
    res.send(`Login Ok - Welcome to home page`)
    res.status(200).send();
})

userRouter.post('/login', async (req, res, next) => {
    try {
        const user = {
            username: req.body.username,
            password: req.body.password, 
        }
        const checkIfExists = await pool.query('SELECT id, username, password FROM users WHERE username=$1', [user.username])
        if (checkIfExists.rows[0] === undefined) {
            throw new Error (`Username ${user.username} not exists`)
        }
        if (checkIfExists.rows[0]['password'] !== user.password) {
                throw new Error ('Enter correct password')
        }
        req.session.userId = checkIfExists.rows[0]['id']
        const newSession = await pool.query('UPDATE users SET sessionid=$1 WHERE id=$2', [req.session.id, checkIfExists.rows[0]['id']])
        const checkCartIfExists = await pool.query('SELECT * FROM cart WHERE customer_id=$1', [req.session.userId])
        if (checkCartIfExists.rows[0] === undefined) {
            const newCart = await pool.query('INSERT INTO cart (customer_id, created_date) VALUES($1, now())', [req.session.userId] )
        } 
    
        res.redirect('/api/user/home')

    } catch(err) {
        next(err);
    }
})

userRouter.get('/logout', redirectLogin, async (req, res) => {
    // try {
    // const deleteCart = await pool.query('DELETE FROM cart WHERE customer_id=$1', [req.session.userId] )
    // } catch(err) {
    //     next(err)
    // }
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/api/user/home')
        }
        res.clearCookie('sid')
        res.redirect('/api/user')
    })
})

userRouter.get('/register', redirectHome, (req, res) => {
    res.send(`Register`)
    res.status(200).send();
})

// register user
userRouter.post('/register', async (req, res, next) => {
    try {
        const user = {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email 
        }
        const checkIfExists = await pool.query('SELECT username FROM users WHERE username=$1', [user.username])
        if (checkIfExists.rows[0] !== undefined) {
            if (checkIfExists.rows[0]['username'] === user.username) {
                throw new Error (`Username ${user.username} already exists`)
            }
        }
        const newRegister = await pool.query('INSERT INTO users (username, password, email) VALUES($1, $2, $3)', [user.username, user.password, user.email]); 
        res.status(201).send();

    } catch(err) {
        next(err);
    }
})


export default userRouter;