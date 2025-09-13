// routes/user.js or similar
const express = require('express');
const router = express.Router();
const { ParkingLot } = require('../Models');

router.get('/lots', async (req, res) => {
  try {
    const search = req.query.search || '';
    const lots = await ParkingLot.find({
      parking_lot_name: { $regex: search, $options: 'i' }
    });
    res.json({ lots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching lots' });
  }
});

module.exports = router;
