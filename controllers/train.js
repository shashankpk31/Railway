const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Train = require("../models/train")
const fs = require("fs")

exports.addTrain = asyncHandler(async (req, res, next) => {
    const train = await Train.create(req.body);
    train.save();
    res.status(200).json({
        success: true,
        data: train
    })
})

exports.getTrainByTrainID = asyncHandler(async (req, res, next) => {
    await Train.findOne({
        trainno: req.params["train_id"]
    }, (err, train) => {
        if (err) {
            console.log(err);
        }
        res.status(200).json({
            success: true,
            train
        })
    })
})

exports.editTrainByTrainID = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = req.body;
    let train = await Train.findOneAndUpdate({ trainno: req.params["train_id"] }, fieldsToUpdate, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: train
    })
})

exports.deleteTrainByTrainID = asyncHandler(async (req, res, next) => {

    await Train.findOneAndDelete({ trainno: req.params["train_id"] }, (err, train) => {
        if (err) {
            console.log(err);
        }
        res.status(200).json({
            success: true,
            data: {}
        })
    });

})

exports.SearchTrain = asyncHandler(async (req, res, next) => {
    let train = await Train.find({
        "Route.code": { $all: [req.query.Dst, req.query.Src] }
    })
    const len = train.length;

    train.forEach(element => {
        let dstInd = -1, srcInd = -1, rtLen = element.Route.length;
        element.Route.every(e => {
            if (element.Route[rtLen - 1].code === req.query.Src) {
                return false;
            }
            if (dstInd !== -1 && srcInd !== -1) {
                return false;
            }
            if (e.code === req.query.Dst) {
                dstInd = e.no;
            }
            if (e.code === req.query.Src) {
                srcInd = e.no;
            }
            if (element.Route[rtLen - 1].code === req.query.Dst) {
                dstInd = len;
            }
            return true;
        })
        if (dstInd > srcInd) {
            train.push(element);
        }
    });

    res.status(200).json({
        data: train.slice(len)
    })
})