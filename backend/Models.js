const mongoose = require('mongoose');

const UserSchema= new mongoose.Schema({
    username:{ type: String, required: true, unique: true, },
    email:{ type: String, required: true, unique: true, },
    password:{ type: String, required: true, },
    mobile:{ type: Number, required: true, },
    blocked:{ type: Boolean, default:false, },
    role:{ type: String, default:"user"}
});

const ParkingLotSchema= new mongoose.Schema({
    parking_lot_name:{ type:String, required: true},
    address:{ type: String, required: true},
    pincode:{ type: Number, required: true},
    price: { type: Number, required: true},
    number_of_spots:{ type: Number, required: true},
});

const ParkingSpotSchema = new mongoose.Schema({
  lot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot' },
  status: { type: String, enum: ['V', 'O'], default: 'V' }
});

const ReservationSchema = new mongoose.Schema({
  lot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot' },
  spot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: { type: String, required: true },  
  start_hour: { type: Number, required: true }, 
  end_hour: { type: Number, required: true }, 
  parking_cost: Number,
});

const HistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reservation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
  spot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot' },
  lot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot' },
  booked_on: { type: Date, required: true },
  used_on: { type: Date, required: true },
  start_time: Date,
  end_time: Date,
  duration_hours: Number,
  amount_paid: Number,
  fine_incurred: { type: Number, default: 0 },
  status: { type: String, enum: ['Completed', 'Cancelled', 'Overdue'], default: 'Completed' },
});

const User = mongoose.model('User', UserSchema);
const ParkingLot=mongoose.model('ParkingLot',ParkingLotSchema);
const ParkingSpot=mongoose.model('ParkingSpot',ParkingSpotSchema);
const Reservation=mongoose.model('Reservation',ReservationSchema);
const History=mongoose.model('History',HistorySchema);

module.exports={ User, ParkingLot, ParkingSpot, Reservation, History };