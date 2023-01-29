const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Train = require("../models/train")
const fs = require("fs")

exports.addTrain = asyncHandler(async (req, res, next) => {
    const { train_no, train_name, Source_Stn,
        Destination_Stn, Route, SeatsAvailability } = req.body;
    const train = await Train.create({
        train_no, train_name, Source_Stn,
        Destination_Stn, Route, SeatsAvailability
    })
    train.save();
    res.status(200).json({
        success: true,
        data: train
    })
})

exports.getTrainByTrainID = asyncHandler(async (req, res, next) => {
    let train = await Train.find({
        train_no: req.params.train_id
    })
    res.status(200).json({
        success: true,
        data: train
    })
})

exports.editTrainByTrainID = asyncHandler(async (req, res, next) => {
    const { train_name, Source_Stn, Destination_Stn, SeatsAvailability, Route } = req.body;
    const fieldsToUpdate = { train_name, Source_Stn, Destination_Stn, SeatsAvailability, Route }
    let train = await Train.findOneAndUpdate({ train_no: req.params.train_id }, fieldsToUpdate, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: train
    })
})

exports.deleteTrainByTrainID = asyncHandler(async (req, res, next) => {
    await Train.findOneAndDelete({ train_no: req.params.train_id });
    res.status(200).json({
        success: true,
        data: {}
    })
})

exports.SearchTrain = asyncHandler(async (req, res, next) => {
    let trains = await Train.find({
        "Route.St_Code": { $all: [req.body.srcSt, req.body.dstSt] }
    })
    let len=trains.length;
    for (let i = 0; i < len; i++) {
        const element = trains[i];
        let indSrc = -1, indDst = -1;
        indSrc = element.Route.findIndex(e => e.St_Code === req.body.srcSt);
        indDst = element.Route.findIndex(e => e.St_Code === req.body.dstSt);
        if (indSrc < indDst && indSrc != -1 && indDst != -1) {
            trains.push(element);
        }
    }
    res.status(200).json({
        data: trains.slice(len),
    })
})