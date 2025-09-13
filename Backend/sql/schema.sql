-- CREATE DATABASE store_rating_app;
USE store_rating_app;

/* CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    address VARCHAR(400),
    role ENUM('admin', 'user', 'owner') NOT NULL
);*/

/*CREATE TABLE IF NOT EXISTS stores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL,
    address VARCHAR(400) NOT NULL,
    owner_id INT,
    overall_rating FLOAT DEFAULT 0,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);*/

-- CREATE TABLE ratings (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     store_id INT NOT NULL,
--     rating INT CHECK (rating BETWEEN 1 AND 5),
--     FOREIGN KEY (user_id) REFERENCES users(id),
--     FOREIGN KEY (store_id) REFERENCES stores(id)
-- );

SELECT * FROM users;
