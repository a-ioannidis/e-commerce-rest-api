import pg from 'pg'
// dotenv can acquire .env variables
import dotenv from 'dotenv';
dotenv.config();

//creating pool
const pool = new pg.Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password:process.env.DB_PASSWORD,
    PORT: 5432,

})

pool.connect()
//create users table
pool.query('CREATE TABLE users (id serial primary key, username VARCHAR(30) NOT NULL, password VARCHAR(30) NOT NULL, email VARCHAR(30) NOT NULL);', (err,res) => {
    console.log(err,res)
    pool.end();
})
//under construction
// export const add = async (user) => {
//     pool.connect()
//     return await pool.query('INSERT INTO users VALUES($1, $2, $3'), 
//     [user.username, user.password, user.email]
// }

