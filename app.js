require('dotenv').config();
const express = require('express');
const connectDB = require('./config/database');
const uploadRouter = require('./routes/uploadRouter');
const statusRouter = require('./routes/statusRouter');

const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

// Routes
app.use('/api/upload', uploadRouter);
app.use('/api/status', statusRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));