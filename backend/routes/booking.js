const express = require('express');
const router = express.Router();
const { Reservation } = require('../Models');

// Fetch existing reservations for a spot on a date
router.get('/:spotId/:date', async (req, res) => {
  const { spotId, date } = req.params;
  const reservations = await Reservation.find({ spot_id: spotId, date });
  res.json(reservations);
});

// Book a new slot
router.post('/', async (req, res) => {
  const { spot_id, user_id, date, start_hour, end_hour } = req.body;

  const existing = await Reservation.find({ spot_id, date });

  const overlap = existing.some(r =>
    (start_hour < r.end_hour && end_hour > r.start_hour)
  );

  if (overlap) return res.status(400).json({ error: 'Selected slot overlaps' });

  const reservation = new Reservation({
    spot_id, user_id, date, start_hour, end_hour,
    parking_cost: 50 * (end_hour - start_hour) // temporary fixed rate
  });

  await reservation.save();
  res.json(reservation);
});

module.exports = router;
