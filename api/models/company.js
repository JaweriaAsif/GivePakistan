const mongoose =require('mongoose');
const companySchema = mongoose.Schema({
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
    
    amountdonated: {type: Number},
    amountcollected: {type: Number},
    totatEmployees: {type:Number,default: 0 },
    // employees array
    isDeleted: {type:Boolean,default:false},
});

module.exports= mongoose.model('Company',companySchema);
