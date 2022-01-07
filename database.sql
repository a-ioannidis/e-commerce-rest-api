-- from psql terminal run \i 'C:/Users/IT Dept/Desktop/e-commerce-rest-api/database.sql'


CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(30),
    password VARCHAR(30),
    email VARCHAR(30) UNIQUE,
    sessionid VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price INTEGER,
    image VARCHAR(500) 
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users (id),
    order_date DATE,
    total_cost INTEGER
);

CREATE TABLE IF NOT EXISTS orders_products (
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products (id),
    quantity INTEGER
);

CREATE TABLE IF NOT EXISTS cart (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES users (id),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_cost INTEGER
);

CREATE TABLE IF NOT EXISTS cart_products (
    cart_id integer REFERENCES cart (id),
    product_id INTEGER REFERENCES products (id),
    quantity INTEGER
);

