const express = require('express');
const app = express();
const morgan =require('morgan');
const  bodyParser = require('body-parser');
const mongoose =require('mongoose');


mongoose.connect('mongodb+srv://jaweria:'+process.env.MONGO_ATLAS_PW+'@cluster0.wzz6iqh.mongodb.net/?retryWrites=true&w=majority')

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method === 'OPTIONS'
    ){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();


});

const userRoutes = require('./api/routes/users');
const bankdetailRoutes = require('./api/routes/bankdetails');
const companyRoutes = require('./api/routes/companies');
const fundRoutes = require('./api/routes/fundraisers');
const donationRoutes = require('./api/routes/donations');

app.use('/user',userRoutes);
app.use('/bankdet',bankdetailRoutes);
app.use('/company',companyRoutes);
app.use('/fundraiser',fundRoutes);
app.use('/donation',donationRoutes);

app.use((req,res,next) => {
    const error =new Error('Not found');
    error.status(404);
    next(error);
});

app.use((error,req,res,next) => {
   res.status(error.status || 500 );
   res.json({
    error: {
        message: error.message
    }
   });
});

module.exports =app;