const mongoose = require("mongoose")


const seatSchema = new mongoose.Schema({
    status: Boolean,
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
    dayofarrival: {
        type: new Array(7),
        default: [1, 1, 1, 1, 1, 1, 1]
    },
})

const trainSchema = new mongoose.Schema({
    train_no: {
        type: Number,
        unique: [true, 'train with same no already exist']
    },
    type:String,
    trainName: String,
    schedule: {
        type: new Array(7),
        default: [1, 1, 1, 1, 1, 1, 1]
    },
    distanceInKM: {
        type: Number,
    },
    runtime: {
        days: Number,
        hours: Number,
        mins: Number
    },
    stops: Number,
    avgSpeed: Number,
    Route: [stationSchema],
    seatsAvailibility: {
        firstAc: seatSchema,
        secondAc: seatSchema,
        thirdAc: seatSchema,
        sleeper: seatSchema,
        chaircar: seatSchema,
        executivecar: seatSchema
    }
}, { timestamps: true })


const Train = mongoose.model('Train', trainSchema);

module.exports = Train;