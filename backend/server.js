const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/database');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoute = require('./routes/authRoutes');
const policyRoutes = require('./routes/policyRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const advisorRoutes = require('./routes/AdvisorRoute');
const insuranceRoutes = require('./routes/insuranceRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const appointmentsRouter = require('./routes/appointments');
const bikeInsuranceRoutes = require('./routes/bikeInsuranceRoutes')
const paymentRoutes = require('./routes/paymentRoutes');
const carInsuranceRoutes = require('./routes/carInsuranceRoutes');
const InsuranceRoutes = require('./routes/InsurnaceRoutes');



dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoute);
app.use('/api/products', productRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/advisors', advisorRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/insurance', InsuranceRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/bikeInsurance', bikeInsuranceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/car-insurance', carInsuranceRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT,"0.0.0.0", () => console.log(`Server running on http://0.0.0.0:${PORT}`));
