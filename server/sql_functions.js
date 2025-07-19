const mysql = require('mysql2/promise');
const { json } = require('stream/consumers');
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
    getProductList,
    verifyLogin,
    insertOrderItem,
    getOrder,
    checkOrderExists,
    getProducts
};

async function getProducts(product_name){
    try {
        const getProductsSql ='SELECT * FROM products WHERE product_name LIKE ?'
        const [products] = await pool.query(getProductsSql, [`%${product_name}%`]);
        return [products]
    } catch (error) {
        
    }
}

async function checkOrderExists(order_id) {
    try {
        const checkOrderSql =`SELECT * FROM orders WHERE order_id = ?`
        const [orders] = await pool.query(checkOrderSql, [order_id]);
        return orders.length > 0;
    } catch (error) {
        return false;
    }
}

async function getOrder(order_id) { // Pass pool as an argument or make it globally accessible
    try {
        const orderFound = await checkOrderExists(order_id)
        if(!orderFound){
            return null;
        }
        const getCustomerSql = `
        SELECT c.customer_phone, c.customer_name, c.customer_email FROM customers c
        JOIN orders o ON c.customer_id = o.customer_id
        WHERE o.order_id = ?`
        const [customer] = await pool.query(getCustomerSql, [order_id])
        const getAddressSql = `
        SELECT address FROM orders
        WHERE order_id = ?
        `
        const [fullAddress] = await pool.query(getAddressSql, [order_id])
        const address = {
            street: fullAddress[0].address.split(', ')[0],
            ward: fullAddress[0].address.split(', ')[1],
            district: fullAddress[0].address.split(', ')[2],
            city: fullAddress[0].address.split(', ')[3]
        }

        const getOrderGeneralInfoSql = `
        SELECT payment_type, subtotal, delivery_fee, note, order_id, status, weight FROM orders
        WHERE order_id = ?`
        const [orderGeneralInfo] = await pool.query(getOrderGeneralInfoSql, [order_id]);

        const getCartInfoSql = `
        SELECT * FROM orders_products
        WHERE order_id = ?`
        const [cartInfo] = await pool.query(getCartInfoSql, [order_id])
        const cart = [];

        for(const index of cartInfo){
            const getItemSql = `
            SELECT p.product_id, p.product_name, op.quantity, op.price_at_order, p.weight FROM orders_products op
            JOIN combinations_products cp ON cp.combination_product_id = op.combination_product_id
            JOIN products p ON p.product_id = cp.product_id
            WHERE op.order_id = ?`
            const [item] = await pool.query(getItemSql, [order_id])

            const getSelectedAttributes = `
            SELECT v.variant_name, av.value FROM combinations_products cp
            JOIN attributes_combinations ac ON ac.attribute_combination_id = cp.attribute_combination_id
            JOIN variants v ON ac.variant_id = v.variant_id
            JOIN attributes_variants av ON av.attribute_id = ac.attribute_id
            WHERE cp.combination_product_id = ?;`

            const [combinations] = await pool.query(getSelectedAttributes, [index.combination_product_id])
            const selectedAttributes = {};
            combinations.forEach(index =>{
                selectedAttributes[index.variant_name] = index.value
            })

            const itemFullInfo = {
                product_id: item[0].product_id,
                product_name: item[0].product_name,
                quantity: item[0].quantity,
                price_at_order: item[0].price_at_order,
                selectedAttributes: selectedAttributes,
                weight: item[0].weight
            }
            cart.push(itemFullInfo)
        }
        const order = {
            customer: customer[0],
            address: address,
            payment_type: orderGeneralInfo[0].payment_type,
            subtotal: orderGeneralInfo[0].subtotal,
            delivery_fee: orderGeneralInfo[0].delivery_fee,
            note: orderGeneralInfo[0].note,
            order_id: orderGeneralInfo[0].order_id,
            status: orderGeneralInfo[0].status,
            weight: orderGeneralInfo[0].weight,
            arrival_date: orderGeneralInfo[0].arrival_date,
            cart: cart
        };
        return order;
        
    } catch (error) {
        console.error(error)
        return null;
    }
}

async function verifyLogin(user) {
    const checkUserSql = `SELECT * FROM users WHERE user_name = ? AND password = ?`;
    const [userRows] = await pool.query(checkUserSql, [user.user_name, user.password])
    if(userRows.length > 0){
        return userRows[0].user_id
    }
    else{
        return -1;
    }
}

async function checkCustomerExists(customer_phone) {
    const checkCustomerSql = `SELECT * FROM customers WHERE customer_phone = ?`;
    const [customerRows] = await pool.query(checkCustomerSql, [customer_phone]);
    return customerRows.length > 0;
}

async function insertCustomer(customer) {
    const insertCustomerSql = `INSERT INTO customers (customer_name, customer_phone, customer_email) VALUES (?, ?, ?)`;
    await pool.query(insertCustomerSql, [customer.customer_name ,customer.customer_phone, customer.customer_email]);
}

async function getCustomerId(customer_phone) {
    const getUserIdSql = `SELECT customer_id FROM customers WHERE customer_phone = ?`;
    const [customerIdRows] = await pool.query(getUserIdSql, [customer_phone]);
    return customerIdRows[0].customer_id;
}

async function insertOrder(order, customer_id) {
    const insertOrderSql = `
        INSERT INTO orders (order_id, subtotal, delivery_fee, payment_type, customer_id, status, address, weight, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    await pool.query(insertOrderSql, [
        order.order_id,
        order.subtotal,
        order.delivery_fee,
        order.payment_type,
        customer_id,
        order.status,
        `${order.address.street}, ${order.address.ward}, ${order.address.district}, ${order.address.city}`,
        order.weight,
        order.note
    ]);
}

async function insertOrderItem(order) {
  for (const item of order.cart) {
    const { product_id, selectedAttributes } = item;
    const keys = Object.keys(selectedAttributes);
    const values = Object.values(selectedAttributes);

    // Step 1: Build dynamic SQL for HAVING clause
    let havingClauses = '';
    const queryParams = [product_id, ...values];

    keys.forEach((key, index) => {
      const value = values[index];
      havingClauses += `
        AND SUM(CASE WHEN v.variant_name = ? AND av.value = ? THEN 1 ELSE 0 END) > 0
      `;
      queryParams.push(key, value);
    });

    // Step 2: Build SQL
    const getCombinationProductIdSql = `
      SELECT
          cp.*
      FROM
          combinations_products cp
      JOIN
          attributes_combinations ac ON cp.attribute_combination_id = ac.attribute_combination_id
      JOIN
          variants v ON ac.variant_id = v.variant_id
      JOIN
          attributes_variants av ON ac.attribute_id = av.attribute_id
      WHERE
          cp.product_id = ?
          AND av.value IN (${values.map(() => '?').join(', ')})
      GROUP BY
          cp.combination_product_id
      HAVING 1=1
          ${havingClauses}
    `;

    let combination_product_id;
    try {
      const [rows] = await pool.query(getCombinationProductIdSql, queryParams);
      console.log(`Found combination_product_id for ${product_id}:`, rows[0]?.combination_product_id);
      combination_product_id = rows[0]?.combination_product_id;
      if(rows[0].stock == 0 || item.quantity > rows[0].stock){
        throw Error(message = "A product has changed")
      }
    } catch (err) {
      console.error('Error inserting order item:', err.message);
      return err.message;
    }

    const insertProductSql = `INSERT INTO orders_products (combination_product_id, order_id, quantity, price_at_order) VALUES (?, ?, ?, ?)`;
    try {
        await pool.query(insertProductSql, [combination_product_id, order.order_id, item.quantity, item.price_at_order]);
    } catch (error) {
        console.error(error);
        return false;
    }
  }
  return true;
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