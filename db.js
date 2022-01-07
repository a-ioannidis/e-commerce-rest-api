import pg from 'pg'
// dotenv can acquire .env variables
import dotenv from 'dotenv';
dotenv.config();

// creating pool
 const pool = new pg.Pool({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD,
    PORT: process.env.DB_PORT,

    })
    

export default pool;
