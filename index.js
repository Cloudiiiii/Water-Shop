const express = require('express');     //variables are set up for use with express and express validataor
const path = require('path');
const {check, validationResult} = require('express-validator');
var myApp = express();

const mongoose = require('mongoose');       //DB connection setup
const { Console } = require('console');
mongoose.connect('mongodb://localhost:27017/mywebsite', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Order = mongoose.model('Order', {
    name : String,
    email : String,
    phone : String, 
    address : String,
    city : String, 
    postt : String,
    province : String,
    water1 : Number,
    water3 : Number,
    delivery : Number,
    subTotal : Number,
    tax : Number,
    total : Number
});

myApp.use(express.urlencoded({extended:false}));       //set paths
myApp.set('views', path.join(__dirname, 'views'));
myApp.use(express.static(__dirname+'/public'));
myApp.set('view engine', 'ejs');

myApp.get('/', function(req, res){      //render page
    res.render('form');
});

myApp.post('/', [
    check('name', 'Please enter a name').notEmpty(),    //validations
    check('email', 'Please enter an email').isEmail(),
    check('phone', 'Please enter a phone number').isMobilePhone(),
    check('address', 'Please enter an address').notEmpty(),
    check('city', 'Please enter a city').notEmpty(),
    check('province', 'Please enter a province').notEmpty()
    
],function(req, res){

    const errors = validationResult(req);               //if validations don't pass create errors
    if (!errors.isEmpty())
    {
        res.render('form', {                            //if errors add to an array
            errors:errors.array()
        });
    }
    else                                                //if no errors get info from client
    {
        var name = req.body.name;
        var email = req.body.email;
        var phone = req.body.phone;
        var address = req.body.address;
        var city = req.body.city;
        var postt = req.body.postt;
        var province = req.body.province;
        var water1 = req.body.water1;
        var water3 = req.body.water3;
        var delivery = req.body.delivery;

        var subTotal = water1*1 + water3*3;             //calculate tax and totals
        var tax = subTotal * 0.13;
        var total = subTotal + tax;

        var pageData =                                  //page data updated
        {
            name : name,
            email : email,
            phone : phone, 
            address : address,
            city : city, 
            postt : postt,
            province : province,
            water1 : water1,
            water3 : water3,
            delivery : delivery,
            subTotal : subTotal,
            tax : tax,
            total : total
        }

        var newOrder = new Order(pageData);     //db store
        newOrder.save().then(function(){ 
            console.log('Order placed')
        });

        res.render('form', pageData);
    }
});

myApp.get('/allorders', function(req, res){     //all orders page
    Order.find({}).exec(function(err, orders){
        console.log(err);
        res.render('allorders', {orders: orders});
    });
});

myApp.listen(8080);     //listen to port 8080

console.log('Everything executed properly link is http://localhost:8080');      //if it works give link to website