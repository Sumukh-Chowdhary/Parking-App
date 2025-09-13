const express = require('express')
const router = express.Router()
const { ParkingLot, ParkingSpot, Reservation, History } = require('../Models.js')

router.get('/lots', async (req, res) => {
  try {
    const search = req.query.search || ''
    const lots = await ParkingLot.find({ parking_lot_name: { $regex: search, $options: 'i' } })
    res.json({ lots })
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/lots/:lotId/spots', async (req, res) => {
  try {
    const { lotId } = req.params
    const spots = await ParkingSpot.find({ lot_id: lotId }).sort({ _id: 1 })
    res.json({ spots })
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/spots/:spotId/latest-reservation', async (req, res) => {
  try {
    const { spotId } = req.params
    const reservation = await Reservation.findOne({ spot_id: spotId }).sort({ start_hour: -1 })
    res.json({ reservation })
  } catch {
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/lots/:lotId/book', async (req, res) => {
  try {
    const { lotId } = req.params
    const { user_id, date, start_hour, end_hour } = req.body

    if (!user_id || !date || start_hour == null || end_hour == null) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const lot = await ParkingLot.findById(lotId)
    if (!lot) return res.status(404).json({ message: 'Lot not found' })

    const spot = await ParkingSpot.findOne({ lot_id: lotId, status: 'V' }).sort({ _id: 1 })
    if (!spot) return res.status(400).json({ message: 'No available spots' })

    const reservation = new Reservation({
      lot_id: lot._id,
      spot_id: spot._id,
      user_id,
      date,
      start_hour,
      end_hour,
      parking_cost: lot.price
    })

    await reservation.save()

    spot.status = 'O'
    await spot.save()

    res.json({ message: 'Spot booked successfully', reservation })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/reservations', async (req, res) => {
  try {
    const userId = req.query.user_id
    const reservations = await Reservation.find({ user_id: userId })
      .populate('lot_id', 'parking_lot_name address')
      .populate('spot_id')
      .sort({ date: 1, start_hour: 1 })
    res.json({ reservations })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.post('/reservations/:reservationId/leave', async (req, res) => {
  try {
    const { reservationId } = req.params
    const reservation = await Reservation.findById(reservationId)
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' })

    const spot = await ParkingSpot.findById(reservation.spot_id)
    spot.status = 'V'
    await spot.save()

    const history = new History({
      user_id: reservation.user_id,
      reservation_id: reservation._id,
      spot_id: reservation.spot_id,
      lot_id: reservation.lot_id,
      booked_on: new Date(),
      used_on: new Date(),
      start_time: new Date(`${reservation.date}T${reservation.start_hour}:00:00`),
      end_time: new Date(`${reservation.date}T${reservation.end_hour}:00:00`),
      duration_hours: reservation.end_hour - reservation.start_hour,
      amount_paid: reservation.parking_cost,
      status: 'Completed'
    })
    await history.save()

    await reservation.deleteOne()

    res.json({ message: 'Reservation completed and moved to history' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

router.get('/history', async (req, res) => {
  try {
    const userId = req.query.user_id
    const histories = await History.find({ user_id: userId })
      .populate('lot_id', 'parking_lot_name address')
      .populate('spot_id')
      .sort({ used_on: -1 })
    res.json({ histories })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

module.exports = router
