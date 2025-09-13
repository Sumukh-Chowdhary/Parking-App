const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const Port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.log('MongoDB error:', err.message);
});

const authRoutes = require('./routes/auth');
const parkingLot= require('./routes/parkingLot');
const parkingSpot= require('./routes/parkingSpot');
const book = require('./routes/booking');
const lot= require('./routes/lots');

app.use('/api', authRoutes);
app.use('/api/admin/lots',parkingLot);
app.use('/api/admin/lot',parkingSpot);
app.use('/api/user/reservations', book);
app.use('/api/user',lot);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`);
});