//var request = require('request'),
var express = require('express');

var app = express.createServer(express.logger());

app.use(express.bodyParser());

app.use('/static', express.static(__dirname + '/static')); 

app.get('/', function(req, res) {
    res.render('index.ejs', { layout: false});
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
