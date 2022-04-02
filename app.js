//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./model/user")
const bcrypt = require("bcryptjs")

var curUser = {}

mongoose.connect('mongodb://localhost:27017/login-app-db' , {
  useNewUrlParser :true,
  useUnifiedTopology :true
})
.then(() => console.log('MongoDB connection established.'))
.catch((error) => console.error("MongoDB connection failed:", error.message))

const homeStartingContent = "Hello ! This Is Website Set Up For Karo Startup Student Ambassador Website .";

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.json());


app.get("/",function(req,res){
    res.render("home" ,{ homePara : homeStartingContent });
});

app.get("/login",function(req,res){
  res.render("login");
});


app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful
    curUser = user;
    // res.render("userDashboard");
		return res.json({ status: 'ok'})
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.get("/dashboard",function(req,res){
  console.log(curUser)
  res.render("userDashboard" ,{ user : curUser})
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register" , async (req ,res) =>{
  console.log(req.body)
  const {username , password : plainTextPassword , email , clgName} = req.body

  if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

  const password = await bcrypt.hash(plainTextPassword , 10)

  try {
    const response = await User.create({
      username,
      password, 
      email,
      clgName
    })
    console.log("User Created Succesfully" , response)
  } catch (error) {
    if(error.code === 11000 ){
    return res.json({ status : 'error' , error : 'Username Already Used'})
  }
  throw error
 }
  
  res.json({status : 'ok'})
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
