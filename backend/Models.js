const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  model: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 }
});

const UserSchema= new mongoose.Schema({
    id:{ type: Number,unique: true},
    username:{ type: String, required: true, unique: true, },
    email:{ type: String, required: true, unique: true, },
    password:{ type: String, required: true, },
    mobile:{ type: Number, required: true, },
    blocked:{ type: Boolean, default:false, },
    role:{ type: String, default:"user"}
});

const ParkingLotSchema= new mongoose.Schema({
    id: { type:Number, unique:true},
    parking_lot_name:{ type:String, required: true},
    address:{ type: String, required: true},
    pincode:{ type: Number, required: true},
    price: { type: Number, required: true},
    number_of_spots:{ type: Number, required: true},
});

const ParkingSpotSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  lot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingLot' },
  status: { type: String, enum: ['V', 'O'], default: 'V' }
});

const ReservationSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  lot_id:{ type:mongoose.Schema.Types.ObjectId, ref: 'ParkingLot'},
  spot_id: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSpot' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parking_timestamp: Date,
  leaving_timestamp: Date,
  parking_cost: Number,
});

const HistorySchema = new mongoose.Schema({
  id: { type: Number, unique: true },
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

function applyAutoIncrement(schema,modelName){
    schema.pre('save', async function (next) {
        if (this.isNew) {
            const counter = await Counter.findOneAndUpdate(
            { model: modelName },
            { $inc: { count: 1 } },
            { new: true, upsert: true }
        );
        this.id = counter.count;
        }
        next();
    });
}

const User = mongoose.model('User', UserSchema);
const Counter = mongoose.model('Counter', counterSchema);
const ParkingLot=mongoose.model('ParkingLot',ParkingLotSchema);
const ParkingSpot=mongoose.model('ParkingSpotSchema',ParkingSpotSchema);
const Reservation=mongoose.model('Reseravation',ReservationSchema);
const History=mongoose.model('History',HistorySchema);

applyAutoIncrement(UserSchema,'User');
applyAutoIncrement(ParkingLotSchema,'ParkingLot');
applyAutoIncrement(ParkingSpotSchema,'ParkingSpot');
applyAutoIncrement(ReservationSchema,'Reservation');
applyAutoIncrement(HistorySchema,'History');

module.exports={ User, Counter, ParkingLot, ParkingSpot, Reservation, History };