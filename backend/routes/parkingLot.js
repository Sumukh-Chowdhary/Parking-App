const express = require('express');
const router=express.Router();
const { ParkingLot, ParkingSpot }= require('../Models.js')

router.post('/addlot',async(req,res)=>{
    try{    
        const { parking_lot_name, address, pincode, price, number_of_spots }=req.body;

        const newLot= await ParkingLot.create({
            parking_lot_name,
            address,
            pincode,
            price,
            number_of_spots
        });

        const spots = [];
        for (let i = 0; i < number_of_spots; i++) {
            spots.push({ lot_id: newLot._id, status: 'V' });
        }

        await ParkingSpot.insertMany(spots);

        res.status(201).json({ message:'Parking Lot successfully created', lot:newLot});
    }catch(err){
        res.status(500).json({message:'Server Error'})
    }
});


router.get('/getLot', async(req,res)=>{
    try{
        const lots= await ParkingLot.find();
        res.status(200).json({message:"All Lots reterieved", lots})
    }catch(err){
        res.status(500).json({message:"Internal Server Error"});
    }
});

module.exports=router;