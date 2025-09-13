const express=require('express');
const router= express.Router();

const { ParkingSpot }= require('../Models.js');

router.get(`/:lotId/spots/getSpots`,async(req,res)=>{
    const { lotId }= req.params;

    try{
        const spots= await ParkingSpot.find({ lot_id:lotId });
        
        res.status(200).json({ message: "Spots retereived ", spots})
    }catch(err){
        res.status(500).json({message:"Internal Server Error"})
    }
});

module.exports= router;