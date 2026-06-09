const express = require('express');
const cors = require('cors');
require('dotenv').config();

const adminRoutes = require('./src/routes/adminRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const instructorRoutes = require('./src/routes/instructorRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/instructor', instructorRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
