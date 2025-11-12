require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PORT, FRONTEND_URL } = require('./config');
const authRoutes = require('./routes/auth');
const googleRoutes = require('./routes/google');
const passport = require('passport');

const app = express();

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/api', authRoutes);
app.use('/api', googleRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Frontend URL: ${FRONTEND_URL}`);
});
