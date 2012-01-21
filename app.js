//var request = require('request'),
var express = require('express');

var app = express.createServer(express.logger());

if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(":")[1]);
} else {
  var redis = require("redis").createClient();
}


var email = require('mailer');

app.use(express.bodyParser());

app.use('/static', express.static(__dirname + '/static')); 


var randomString = function(length) {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    var string_length = length || 8;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}


app.get('/', function(req, res) {
    res.render('index.ejs', { layout: false});
});

app.post('/send', function(req, res){

    if(validateEmail(req.body.toaddress)){

        var urlhash = randomString(8);
        redis.set('postcard:'+urlhash, JSON.stringify({"to":{"name":req.body.toname,
                                                             "address":req.body.toaddress},
                                                       "from":{"name":req.body.fromname,
                                                               "address":req.body.fromaddress},
                                                       "message":req.body.message,
                                                       "date":(new Date()).getTime()}));

        //Send email.
        // include the from/to  and link to the message
    
        email.send({
            host: 'smtp.sendgrid.net',
            port: '587',
            authentication: 'plain',
            username: process.env.SENDGRID_USERNAME,
            password: process.env.SENDGRID_PASSWORD,
            domain: 'heroku.com',
            to: req.body.toaddress,
            from: req.body.fromaddress,
            subject: 'Aloha from Honolulu!',
            body: 'Aloha! - '+ "http://localhost:3000/postcard/"+urlhash
        }, function (err, result) {
            console.log("sent email", err, result);
        });
        res.send({"status":"ok"});
    }else{
        res.send({"status":"fail"});
    };
});

var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

app.get('/postcard/:id', function(req, res) {
    redis.get("postcard:"+req.params.id, function(err, value) {
        var data = JSON.parse(value);
        var date = new Date(data.date);
        data.datestring = months[date.getMonth()]+ " " + date.getDate()+", "+date.getFullYear();
        res.render('postcard.ejs', { layout: false, data: data});
    });

    
});

function validateEmail(elementValue){  
   var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;  
   return emailPattern.test(elementValue);  
} 

/*app.post('/api/email', function(req, res){                
    var email = req.param("email");

    if(validateEmail(email)){

    var data = {"secret":"9b395606592c87ffb4deaeb21f9c1c973d8f5587",
                "app_id":"36",
                "to":email,
                "text":"Your friend is at: "+lat+", "+lng+" track them on http://geotrack.mapchat.im",
                "html":"<h2>Friend's Location:</h2><img src='http://maps.googleapis.com/maps/api/staticmap?center="+lat+
                ","+lng+"&zoom=14&size=512x512&maptype=roadmap&sensor=true' />"+
                "  <img src='http://dmt.im:3000/email/trackback?email="+email+"' width='1', height='1' /> "+
                "<a href='http://geotrack.mapchat.im'>Track in real-time</a>",
                "subject":"Your friends location"}

    console.log(JSON.stringify(data));
    request({"url":"https://api.inboxfever.com/api/v1/email/send", "body":JSON.stringify(data)},function(error, req,  res){
        console.log(res);
    });

    }else{
        // assume it is a phone number
        phone.sendSms("+1"+email, "Track your friend: http://geotrack.mapchat.im", {}, function(){}); 
    }
    res.send({status:"ok"});
});*/

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
