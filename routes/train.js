const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const { addTrain, editTrainByTrainID, getTrainByTrainID, deleteTrainByTrainID,
    SearchTrain } = require('../controllers/train')

router.get('/',(req,res)=>{
    res.status(200).json({
        msg:"Welcome to Train Requests"
    })
})
router.post('/addTrain', protect, authorize(['admin']), addTrain);
router.get('/:train_id', protect, authorize(['admin']), getTrainByTrainID);
router.put('/:train_id', protect, authorize(['admin']), editTrainByTrainID);
router.delete('/:train_id', protect, authorize(['admin']), deleteTrainByTrainID);
router.post('/search', SearchTrain)

module.exports = router;