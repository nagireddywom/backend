 require('dotenv').config();
const app = require('./App');
const connectDB = require ('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  });