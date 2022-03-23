//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");


const homeStartingContent = "Hello ! This Is Website Set Up For Karo Startup Student Ambassador Website .";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/",function(req,res){
    res.render("home" ,{ homePara : homeStartingContent });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
