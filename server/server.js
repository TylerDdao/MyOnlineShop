// // server.js
// const express = require('express');
// const Order = require('./models/Order');

// const app = express();
// app.use(express.json());


// app.post('/api/orders', async (req, res) => {
//   try {
//     const order = new Order(req.body);
//     await order.save();
//     res.status(201).json({ message: 'Order saved' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // server.js
// app.get('/api/orders', async (req, res) => {
//   try {
//     const orders = await Order.find(); // Fetch all orders
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(3000, () => console.log('Server running'));


// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(express.json());

const sql_functions = require('./sql_functions');
const { STATUS_CODES } = require('http');


// Allow requests from your frontend (adjust origin as needed)
app.use(cors({
  origin: [
    'https://dtg8bgc8-5173.asse.devtunnels.ms',
    process.env.DOMAIN_URL || 'http://localhost:5173' // Fallback to localhost if DOMAIN_URL is not set
  ],
  credentials: false
}));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

app.get('/api/shipment-fee', async (req, res) => {
  try {
    const { address, province, district, weight, value } = req.query;
    console.log('Received query:', req.query);

    const response = await axios.get('https://services.giaohangtietkiem.vn/services/shipment/fee', {
      params: {
        address,
        province,
        district,
        pick_province: 'Hà Nội',
        pick_district: 'Nam Từ Liêm',
        weight,
        value,
        deliver_option: 'none'
      },
      headers: {
        'Token': process.env.GHTK_TOKEN,
      }
    });

    console.log(province);  // now this works, because province is defined above
    res.json(response.data);
  } catch (error) {
    console.log(province);  // same here
    console.error('Error fetching shipment fee from GHTK:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      res.status(500).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

app.post('/api/login', async(req, res) =>{
  try {
    const user = req.body;
    const user_id = await sql_functions.verifyLogin(user)
    if(user_id >=0){
      res.status(200)
      res.json({ success: true, message: 'login success', user_id: user_id})
    }
    else{
      res.status(401)
      res.json({success: false, message: "Incorrect user name or password"})
    }
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json({message: error})
  }
});

app.get('/api/verify-orderid', async (req, res) => {
  try {
    const order_id = req.query.id;
    if (!order_id) return res.status(400).json({ error: 'Missing id in query' });

    const [rows] = await pool.query('SELECT * FROM orders WHERE order_id = ?', [order_id]);
    console.log('Querying MySQL for order ID:', order_id);
    res.json({ isValid: rows.length === 0 });
  } catch (error) {
    console.error('Error querying MySQL:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/product-list', async (req, res) =>{
  const query = req.query.query
  try {
    if(query){
      const [productList] = await sql_functions.getProducts(query);
      console.dir(productList, { depth: null });
      res.status(200)
      res.json(productList)
    }
    else{
      const [productList] = await sql_functions.getProductList();
      console.dir(productList, { depth: null });
      res.status(200)
      res.json(productList)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.get('/api/product-detail', async (req, res) => {
  try {
    const productId = req.query.productId;
    if (!productId) return res.status(400).json({ error: 'Missing productId in query' });

    const rows = await sql_functions.getProductDetail(productId);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Build product basic info from first row
    const product = {
      product_id: rows[0].product_id,
      product_name: rows[0].product_name,
      price: rows[0].price,
      description: rows[0].description,
      number_of_images: rows[0].number_of_images,
      weight: rows[0].weight,
      combinations: []
    };

    // Group rows by attribute_combination_id
    const combinationMap = {};
    for (const row of rows) {
      const combId = row.attribute_combination_id;
      if (!combinationMap[combId]) {
        combinationMap[combId] = {
          stock: row.stock,
          attribute: []
        };
      }
      combinationMap[combId].attribute.push({
        id: row.attribute_id,
        value: row.attribute_value,
        variant: {
          id: row.variant_id,
          name: row.variant_name
        }
      });
    }

    // Convert to array
    product.combinations = Object.values(combinationMap);

    console.dir(product, { depth: null });
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/place-order',async  (req, res) => {
  const order = req.body;  // req.body now contains the whole Order object

  console.log('✅ Received order from frontend:');
  console.dir(order, { depth: null }); // print deeply nested object

  try {
    const customerExists = await sql_functions.checkCustomerExists(order.customer.customer_phone);
    if(!customerExists) {
      await sql_functions.insertCustomer(order.customer);
    }
    const customer_id = await sql_functions.getCustomerId(order.customer.customer_phone);
    sql_functions.insertOrder(order, customer_id);
    const result = sql_functions.insertOrderItem(order)
    if(result){
      res.status(200)
      res.json({ success: true, message: 'Order received', orderId: order.id });
    }
    else{
      throw Error(message = result?.message)
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message, orderId: order.id });
  }
});

app.get('/api/search-order', async (req, res) => {
  try {
    const order_id = req.query.order_id
    const order = await sql_functions.getOrder(order_id)
    if(order){
      res.status(200)
      res.json({success: true, message: "Order found", order: order})
    }
    else{
      res.status(404)
      res.json({success: false, message: "Order can't be found"})
    }
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json({success: false, message: "Failed to search for order, please try again"})
  }
})

app.get('/api/search-product', async (req,res) =>{
  try {
    const query = req.query.query
    const products = await sql_functions.getProducts(query);
    console.log(products)
  } catch (error) {
    
  }
})

app.get('/api/test', async (req, res)=>{
  try {
    const order_id = req.query.order_id
    const order = await sql_functions.getOrder(order_id)
    if(order){
      res.status(200)
      res.json({success: true, message: "Order found", order: order})
    }
    else{
      res.status(404)
      res.json({success: false, message: "Order can't be found"})
    }
  } catch (error) {
    console.log(error)
    res.status(500)
    res.json({success: false, message: "Failed to search for order, please try again"})
  }
})

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
