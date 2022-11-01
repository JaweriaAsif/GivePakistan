const mongoose =require('mongoose');
const donationSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid: {type: String},
    fundraiserid: {type: String},
    detid:{type: String},
    amountdonated: {type: Number},
    anonymous: {type:Boolean,default:false},
});

module.exports= mongoose.model('Donation',donationSchema);
