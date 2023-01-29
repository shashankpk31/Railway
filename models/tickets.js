const mongoose = require("mongoose")
const { Schema } = mongoose;

const passengerSchema = new Schema({
    p_name: {
        type: String,
        required: true
    },
    p_dob: {
        type: Date,
        required: true
    },
    p_gender:{
        type:String,
        required:true
    },
    p_aadhar_num: {
        type: Number
    },
    phone_number: {
        type: Number
    },
    tickit_status:{
        type:String,
        enum:["CNF","RAC","WL"]
    },
    tickit_coach:{
        type:String
    },
    Seat_Berth_WLNO:{
        type:Number
    }
});

const ticketSchema = new Schema({
    PnrNo: {
        type: Number,
        len: 10
    },
    train_No_Name:{
        type:String
    },
    Quota:{
        type:String,
        enum:["TATKAL(TQ)","GENRAL(GN)","LADIES(LD)",
        "PREMIUM TATKAL (PTQ)","LOWER BERTH (SS)",
        "PHYSICALLY HANDICAPPED (HP)","HEADQUATERS/HIGH OFFICIALS (HO)"]
    },
    datetime_of_booking: {
        type: Date
    },
    datetime_of_journey: {
        type: Date
    },
    datetime_of_departure: {
        type: Date
    },
    onBoarding_Stn: {
        type:String
    },
    onDeparture_Stn: {
        type:String
    },
    Journey_distance: {
        type: Number
    },
    Passengers: [passengerSchema],
    
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports=Ticket;