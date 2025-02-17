// require('dotenv').config();
// const express = require('express');
// const connectDB = require('./Config/Database');
// const authRoutes = require('./routes/auth.routes');
// const errorMiddleware = require('./middleware/error.middleware');

// const app = express();



// // Connect to Database
// connectDB();

// // Middleware
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);

// // Error Handler
// app.use(errorMiddleware);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.route');
const orderRoutes = require('./routes/order.routes');
const razorpayRoutes = require('./routes/razorpayRoutes');
const connectDB = require('./config/database');
const shiprocketRoutes = require('./routes/ship.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', razorpayRoutes);
app.use('/api/shiprocket', shiprocketRoutes);

// Test route
// app.get('/test', (req, res) => {
//   res.json({ message: 'Backend is working!' });
// });

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` });
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log('Available routes:');
//   console.log('- POST /api/auth/register');
//   console.log('- POST /api/auth/login');
//   console.log('- GET /test');
// });

// process.on('unhandledRejection', (err) => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

module.exports = app;