const mongoose =require('mongoose');
const bankSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    accountNo: {type: Number,},
    userId: mongoose.Schema.Types.ObjectId,
    isDeleted: {type:Boolean,default:false}
});

module.exports= mongoose.model('Bank', bankSchema);
