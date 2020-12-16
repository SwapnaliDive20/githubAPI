const express = require('express')
const app = express()
const path = require('path')
var bodyParser = require('body-parser')
var port = 3000;

const MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/mydb";

const router = express.Router();

const axios = require('axios')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  console.log("Database connected!");

  var dbo = db.db("mydb");
  dbo.listCollections().toArray(function (err, items) {
    if (err) throw err;
    console.log(items[0].name + " collection already exists");

    if (items.length == 0)
      dbo.createCollection("customers", function (err, res) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("customers collection created !")
        }
      })
  });
  db.close();
});

// insert new record into database 

router.post('/insert', function (req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var address = req.body.address;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myobj = { id: id, name: name, address: address };
    dbo.collection("customers").insertOne(myobj, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });

  console.log(id + name + address);
  res.json("Record inserted successfully");
})

// display all records 

router.get('/display', function (req, res) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    dbo.collection("customers").find({}).toArray(function (err, result) {
      if (err) throw err;
      console.log("result console  : ", result);
      res.json(result);
      db.close();
    });
  });
})

// update name using id

router.post('/update', function (req, res) {
  var id = req.body.id;
  var name = req.body.name;

  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { id: id };
    var newvalues = { $set: { name: name } };
    dbo.collection("customers").updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      db.close();
    });
  });
  res.json("Record updated successfully");
})

// delete using id
router.post('/delete', function (req, res) {
  var id = req.body.id;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("mydb");
    var myquery = { id: id };
    dbo.collection("customers").deleteOne(myquery, function (err, res) {
      if (err) throw err;
      console.log("1 document deleted");
      db.close();
    });
  });
  res.json("Record deleted successfully");
})

// create repository in git using github api

router.post('/createRepository', function(req, res){
  axios
  .post('https://api.github.com/user/repos?access_token=743a7a19cfc56aaa3ab57671f2ee9872182a7493', {
    "name": "fourthRepo",
    "description": "Repo created using github api",
    "homepage": "https://github.com",
    "private": false,
  })
  .then(res => {
    console.log(`statusCode: ${res.status}`)
    //console.log(res)    
  })
  .catch(error => {
    console.error(error)
  })
  res.json("Repository Created");
})

// create repository in git using github api

router.post('/deleteRepository', function(req, res){    
  axios
  .delete('https://api.github.com/repos/SwapnaliDive20/ThirdRepo?access_token=743a7a19cfc56aaa3ab57671f2ee9872182a7493')
  .then(res => {
    console.log(`statusCode: ${res.status}`)        
    // console.log(res)    
  })
  .catch(error => {
    console.error(error)    
  })  
  res.json("Repository Deleted");
})

app.use('/api', router);

app.listen(port, function () {
  console.log('We are listening on port ' + port)
})




