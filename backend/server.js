const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();
const videoRoutes = require('./routes/videoRoutes');
const app = express();
const PORT = process.env.PORT || 5000;
const cors= require('cors');

app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running...');
});  // Homepage route

connectDB();  // Connect to MongoDB

app.use(express.json());  // Middleware for JSON body-parsing

app.use('/api/videos', videoRoutes);  // Video routes

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
