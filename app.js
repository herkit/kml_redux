var express = require('express');
var app = express();
var fs = require("fs");

var multer = require("multer");
var upload = multer();

var engine = require("express-ejs-layouts");
var uuid = require('node-uuid');

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(engine);
app.use(express.static('public'));
app.get('/', function(req, res) {
    res.render('index');
});


var files = {};

// about page 
app.post('/upload', upload.single('kml_file'), function(req, res) {
  var uid = uuid.v4();
  files[uid] = req.file;
  setTimeout(function() { 
    console.log("deleting file ", files[uid]);
    delete files[uid]; 
    console.log("Deleted temporary file " + uid + " proof: ", files[uid]); 
  }, 60000);

  res.render('uploaded_kml', { data: JSON.stringify({
    filename: req.file.originalname, 
    type: req.file.mimetype, 
    fileuid: uid, 
    tolerance: req.body.tolerance 
  })});
});

app.get("/file/:uid", function (req, res) {
  res.send(files[req.params.uid].buffer);
});

app.listen(8080);
console.log('8080 is the magic port');