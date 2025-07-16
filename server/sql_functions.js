const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = {
    checkCustomerExists,
    insertCustomer,
    getCustomerId,
    insertOrder,
    getProductDetail,
    getProductList
};

async function checkCustomerExists(phone) {
    const checkCustomerSql = `SELECT * FROM customers WHERE customer_phone = ?`;
    const [customerRows] = await pool.query(checkCustomerSql, [phone]);
    return customerRows.length > 0;
}

async function insertCustomer(customer) {
    const insertCustomerSql = `INSERT INTO customers (customer_name, customer_phone, customer_email) VALUES (?, ?, ?)`;
    await pool.query(insertCustomerSql, [customer.name ,customer.phone, customer.email]);
}

async function getCustomerId(phone) {
    const getUserIdSql = `SELECT customer_id FROM customers WHERE customer_phone = ?`;
    const [customerIdRows] = await pool.query(getUserIdSql, [phone]);
    return customerIdRows[0].customer_id;
}

async function insertOrder(order, customerId) {
    const insertOrderSql = `
      INSERT INTO orders (order_id, subtotal, delivery_fee, payment_type, customer_id, status, address, weight)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(insertOrderSql, [
      order.id,
      order.subtotal,
      order.deliveryFee,
      order.payment,
      customerId,
      order.status,
      `${order.address.street}, ${order.address.district}, ${order.address.city}`,
      order.total_weight
    ]);
}

async function getProductList(){
    const getListSql = `SELECT * FROM products`
    const [list] = await pool.query(getListSql);
    return [list]
}

async function getProductDetail(productId) {
  const getProductSql = `
    SELECT
        p.product_id,
        p.product_name,
        p.number_of_images,
        p.weight,
        p.price,
        p.description,
        cp.stock,
        ac.attribute_combination_id,
        av.attribute_id,
        av.value AS attribute_value,
        v.variant_id,
        v.variant_name
    FROM products p
    JOIN combinations_products cp 
        ON p.product_id = cp.product_id
    JOIN attributes_combinations ac 
        ON cp.attribute_combination_id = ac.attribute_combination_id
    JOIN attributes_variants av 
        ON ac.attribute_id = av.attribute_id
    JOIN variants v 
        ON av.variant_id = v.variant_id
    WHERE p.product_id = ?
    ORDER BY ac.attribute_combination_id, v.variant_name
  `;
  const [rows] = await pool.query(getProductSql, [productId]);
  return rows;
}
