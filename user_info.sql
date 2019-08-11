 CREATE DATABASE IF NOT EXISTS ECOMMERCE;
 USE ECOMMERCE;
 DROP TABLE IF EXISTS user_info;
 CREATE TABLE IF NOT EXISTS user_info (
     fname VARCHAR(100) NOT NULL,
     lname VARCHAR(100) NOT NULL,
     address VARCHAR(200) NOT NULL,
     city VARCHAR(100) NOT NULL,
     state VARCHAR(100) NOT NULL,
     zip VARCHAR(100) NOT NULL,
     email VARCHAR(200) NOT NULL,
     username VARCHAR(100) NOT NULL,
     password VARCHAR(100) NOT NULL,
     userId int NOT NULL AUTO_INCREMENT,
     PRIMARY KEY (userId),
     CONSTRAINT username_unique UNIQUE (username)  
 );
 DROP TABLE IF EXISTS product_table;
 CREATE TABLE IF NOT EXISTS product_table (
     asin VARCHAR(100) NOT NULL,
     productName VARCHAR(100) NOT NULL,
     productDescription VARCHAR(200) NOT NULL,
     groupName VARCHAR(200) NOT NULL,
     CONSTRAINT asin_unique UNIQUE (asin)
 );

 DROP TABLE IF EXISTS order_info;
 CREATE TABLE IF NOT EXISTS order_info (
      uname VARCHAR(100) NOT NULL,
      asin VARCHAR(100) NOT NULL,
      oid VARCHAR(200) NOT NULL,
      productName VARCHAR(100) NOT NULL,
      UNIQUE KEY (asin, oid)
 );


 INSERT INTO user_info
 (fname,lname,address,city,state,zip,email,username,password)
 VALUES
 ('Jenny','Admin','','','','','','jadmin','admin');
--  INSERT INTO product_table
--  (asin, productName, productDescription, groupName)
--  VALUES
--  ('1','Sound of Music','dolor.','DVD');
--   INSERT INTO product_table
--  (asin, productName, productDescription, groupName)
--  VALUES
--  ('2','Sound of Music2','dolor.','DVD');
--   INSERT INTO product_table
--  (asin, productName, productDescription, groupName)
--  VALUES
--  ('3','Sound of Music3','dolor.','DVD');

--  INSERT INTO order_info
--  (uname, asin, oid, productName)
--  VALUES
--  ('jadmin', '1','1', 'Sound of Music');
--  INSERT INTO order_info
--  (uname, asin, oid, productName)
--  VALUES
--  ('jadmin', '2','1', 'Sound of Music2');

--   INSERT INTO order_info
--  (uname, asin, oid, productName)
--  VALUES
--  ('jadmin', '1','2', 'Sound of Music');
--  INSERT INTO order_info
--  (uname, asin, oid, productName)
--  VALUES
--  ('jadmin', '3','2', 'Sound of Music3');

--    INSERT INTO order_info
--  (uname, asin, oid, productName)
--  VALUES
--  ('jadmin', '1','3', 'Sound of Music');
--  INSERT INTO order_info
--  (uname, asin, oid, productName)
--  VALUES
--  ('jadmin', '2','3', 'Sound of Music2');

-- SELECT asin, count(*) 
-- FROM order_info,
--     (
--         SELECT asin, oid
--         FROM order_info
--         WHERE asin = '1'
--     ) AS selectInfo
-- WHERE order_info.oid = selectInfo.oid
-- AND asin <> '1';

-- SELECT order_info.asin  FROM order_info, ( SELECT asin, oid FROM order_info WHERE asin = '1' )  AS selectInfo WHERE order_info.oid = selectInfo.oid AND order_info.asin <> '1' GROUP BY order_info.asin ORDER BY count(order_info.asin) DESC;