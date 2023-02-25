const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randomize = require('randomatic');
const { Schema } = mongoose;
const geocoder = require('../utils/geocoder');
const ErrorResponse = require('../utils/errorResponse');
const fs = require("fs");


const passengerSchema = new Schema({
    p_name: {
        type: String,
        required: true
    },
    p_dob: {
        type: Date,
        required: true
    },
    p_gender: {
        type: String,
        required: true
    },
    Seat_Preference: {
        type: String,
        enum: ["No Preference", "Lower Berth (LB)",
            "Middle Berth (MB)", "Upper Berth (UB)",
            "Side Upper (SU)", "Side Lower (SL)"]
    },
    p_aadhar_num: {
        type: Number
    },
    phone_number: {
        type: Number
    }
});

const userSchema = new Schema({
    username: {
        type: String,
    },
    Name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    Phone_no: {
        type: Number,
        unique: [true, 'Phone_no is already registered']
    },
    Email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ]
    },
    Password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,
    },
    DOB: {
        type: Date
    },
    Gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "others"]
    },
    Marital_Status: {
        type: String,
        enum: ["Single", "Married", "Divorced"]
    },
    Occupation: {
        type: String,
        enum: ["Government Service", "Civil Service",
            "Public sector", "Private Service", "Student"]
    },
    Aadhar_Card: {
        type: Number,
        required: true
    },
    Nationality: {
        type: String,
        required: true,
    },
    Residential_Address: {
        type: String
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String,
    },
    Passenger_masterList: { type: [passengerSchema], maxlen: 6 }
    ,
    role: {
        type: String,
        enum: ['user', 'agent', 'admin'],
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    confirmEmailToken: String,
    isEmailConfirmed: {
        type: Boolean,
        default: false,
    },
    twoFactorCode: String,
    twoFactorCodeExpire: Date,
    twoFactorEnable: {
        type: Boolean,
        default: false,
    },
    BookedTickets:{
        type:Schema.Types.ObjectId,
        ref:'ticket'
    }
}, { timestamps: true });

//Encrypting password using bcrypt
userSchema.pre('save', async function (next) {
    const loc = await geocoder.geocode(this.Residential_Address);
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    };
    // restricting users aged less than 18
    if (this.getAge(this.DOB) < 18) {
        next(new ErrorResponse("valid age for registering user is 18 or above here age is" + this.getAge(), 400))
    }
    //checking if Password is modifide then only this will execute
    if (!this.isModified('Password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.Password = await bcrypt.hash(this.Password, salt);
})

// this will calculate the current age of the user
userSchema.methods.getAge = (dob) => {
    var birthday = new Date(dob);
    return ~~((Date.now() - birthday) / (31557600000));
}

// This will generate Signed Jwt Token by id 
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.Password);
};

userSchema.methods.getResetPasswordToken = function () {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Set expire
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

//Generate email confirm token
userSchema.methods.generateEmailConfirmToken = function (next) {
    // email confirmation token
    const confirmationToken = crypto.randomBytes(20).toString('hex');

    this.confirmEmailToken = crypto
        .createHash('sha256')
        .update(confirmationToken)
        .digest('hex');
    const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
    const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`;
    return confirmTokenCombined;
};

module.exports = mongoose.models.user || mongoose.model('user', userSchema);
