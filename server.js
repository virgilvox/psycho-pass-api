var mongojs = require('mongojs')
var express = require('express')
var cors = require('cors')
var config  = require('./config.json')
var app = express()
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

var db = mongojs(config.connectionString);
var mycollection = db.collection('users');

var port = process.env.PORT || 8072 ;

app.post('/create', function (req, res) {
  var body = req.body;
  createUser(body, res);
})

app.post('/update', function (req, res) {
  var body = req.body;
  updateUser(body, res);
})

app.post('/find', function (req, res) {
  var body = req.body;
  findUser(body.username, res);
});

app.post('/login-user', function (req, res) {
  var body = req.body;
  login(body, res);
});

app.get('/psychopass/:id', function (req, res) {
  var user = req.params.id;
  getResume(user, res);
});

app.listen(port)

var createUser = function(body,res){

  var blank = {
  profileImg: 'img/profile.png',
  firstName: 'Test',
  lastName: 'Test',
  group: 'PT',
  mentalColor: 'navy',
  mentalColorName: 'NAVY',
  mainNumber: 86.3,
  mainCf: 7,
  secondColor: 'ready',
  secondColorName: 'RED',
  secondNumber: 75.2,
  secondCf: 4,
  thirdColor: 'yellow',
  thirdColorName: 'YELLOW',
  thirdNumber: 72.3,
  thirdCf: 2
};

  mycollection.findOne({username: body.username}, function(err, doc) {
    if(doc == null){
      var user = {
        username: body.username,
        password: body.password,
        email: body.email,
        psychopass: blank
      };
      mycollection.insert(user, function(err,value){
        return res.status(200).send("created!");
      });
    } else if(doc != null){
      return res.status(200).send("exists");
    }
  });

};

var updateUser = function(body,res){

  mycollection.findAndModify({
    query: { username: body.username, password: body.password },
    update: { $set: { psychopass: body.psychopass } },
    new: true
  }, function (err, doc, lastErrorObject) {
    if (!err){
      return res.status(200).send("updated!");
    }
  });

};

var findUser = function(user, res){

  mycollection.findOne({username: user}, function(err, doc) {
    return res.status(200).send(doc);
  });
};

var login = function(body, res){
  mycollection.findOne({"username": body.username}, function(err, doc) {
    if(!err && doc != null && doc.password == body.password){
      return res.status(200).send(doc);
    }
  });
};

var getResume = function(user, res){
  mycollection.findOne({username: user}, function(err, doc) {
    return res.status(200).send(doc.psychopass);
  });
};
