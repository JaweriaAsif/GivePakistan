const mongoose =require('mongoose');
const fundSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:  {type:String,required:true},
    description:  {type:String,required:true},
    goal: {type: Number, required: true},
    duedate: {type: Date}, 
    category:  {type:String},
    amountdonated: {type: Number},
    amountcollected: {type: Number},
    approved: {type:Boolean,default:false},
    active: {type:Boolean,default:true},
    starter: {type: String}, //user
    approvedby: {type: String}, //useradmin
    //documents, pictures
});

module.exports= mongoose.model('Fundraiser',fundSchema);
