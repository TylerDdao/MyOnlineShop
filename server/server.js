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

app.get('/api/verify-orderid', async (req, res) => {
  try {
    const orderId = req.query.id;
    if (!orderId) return res.status(400).json({ error: 'Missing id in query' });

    const [rows] = await pool.query('SELECT * FROM orders WHERE order_id = ?', [orderId]);
    console.log('Querying MySQL for order ID:', orderId);
    res.json({ isValid: rows.length === 0 });
  } catch (error) {
    console.error('Error querying MySQL:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/product-detail', async (req, res) => {
  try {
    const productId = req.query.productId;
    if (!productId) return res.status(400).json({ error: 'Missing productId in query' });
    const productDetail = await sql_functions.getProductDetail(productId);
    if (!productDetail) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const attributesArray = productDetail.attributes
      .split(', ')
      .map(pair => {
        const [name, value] = pair.split(': ');
        return { name, value };
      });

    // Group by name and keep unique values
    const grouped = Object.values(
      attributesArray.reduce((acc, { name, value }) => {
        if (!acc[name]) {
          acc[name] = { name, values: [] };
        }
        if (!acc[name].values.includes(value)) {
          acc[name].values.push(value);
        }
        return acc;
      }, {})
    );

    productDetail.attributes = grouped;

    console.dir(productDetail, { depth: null })
    res.status(200);
    res.json(productDetail);
  } catch (error) {
    console.log(error) ;
  }
});

app.post('/api/orders',async  (req, res) => {
  const order = req.body;  // req.body now contains the whole Order object

  console.log('✅ Received order from frontend:');
  console.dir(order, { depth: null }); // print deeply nested object

  try {
    const customerExists = await sql_functions.checkCustomerExists(order.customer.phone);
    if(!customerExists) {
      await sql_functions.insertCustomer(order.customer);
    }
    const customerId = await sql_functions.getCustomerId(order.customer.phone);

    insertOrder(order, customerId);
  } catch (error) {
    console.log(error)
  }

  res.json({ success: true, message: 'Order received', orderId: order.id });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
