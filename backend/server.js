const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');


const authRoute = require('./routes/authRoutes')
const policyRoute = require('./routes/policyRoutes')
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const seedAdmin = require('./utils/seedAdmin');

seedAdmin();
dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
  }));
  app.use(express.json());


app.use('/api/products', productRoutes);
app.use('/api/auth', authRoute);
app.use('/api/policies', policyRoute);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
