const mongoose = require("mongoose")


const seatSchema = new mongoose.Schema({
    charges_per_100km: Number,
    total_coach: Number,
    general_seats: Number,
    ladies_seats: Number,
    tatkal_seats: Number,
    senior_citizen: Number
})

const stationSchema = new mongoose.Schema({
    no: Number,
    code: String,
    station: String,
    state: String,
    arrival: String,
    departure: String,
    halt: Number,
    day: Number,
    distance: Number,
    distanceFromSrc: Number,
    dayofarrival: Number
})

const trainSchema = new mongoose.Schema({
    trainno: {
        type: String,
        unique: [true, 'train with same no already exist']
    },
    type: String,
    train_name: String,
    schedule:String,
    distanceInKM: {
        type: Number,
    },
    runtime: {
        days: Number,
        hours: Number,
        mins: Number
    },
    stops: Number,
    avgSpeed: String,
    Route: [stationSchema],
    seatsAvailibility: {
        firstAc: seatSchema,
        secondAc: seatSchema,
        thirdAc: seatSchema,
        sleeper: seatSchema,
        chaircar: seatSchema,
        executivecar: seatSchema,
        accar:seatSchema
    },
    classes:String,
    return:Number
}, { timestamps: true })


const Train = mongoose.model('Train', trainSchema);



module.exports = Train;