const mongoose =require('mongoose');
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username:  {type:String,required:true},
    email: {type:String,
        required:true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type:String,required:true},
    phoneNo: {type: Number,},
    active: {type: Boolean, default: false},
    isCharity: { type : Boolean,default: false},
    amountdonated: {type: Number},
    amountcollected: {type: Number},
    roleId: {type : String,required:true},
    companyId: mongoose.Schema.Types.ObjectId,
    idDeleted: {type:Boolean,default:false},
});

module.exports= mongoose.model('User',userSchema);
