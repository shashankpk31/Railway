const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { addTrain, editTrainByTrainID, getTrainByTrainID, deleteTrainByTrainID,
    SearchTrain } = require('../controllers/train')


router.post('/AddTrain', protect, authorize(["admin"]), addTrain);
router.get('/:train_id', protect, authorize(['admin']), getTrainByTrainID);
router.put('/:train_id', editTrainByTrainID);
router.delete('/:train_id', deleteTrainByTrainID);
router.post('/search', SearchTrain)

module.exports = router;