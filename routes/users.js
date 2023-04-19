const express = require('express')
const router = new express.Router({mergeParams: true})
const User = require('../views/models/user')
const jwt = require("jsonwebtoken");
const jwtKey = "private_key";
const jwtExpirySeconds = 600;


router.post('/users/signup', (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
  console.log('rec');
  if (!email || !password || !username) {
    return res.render('signup',{error: "Fill The Details"});
  } else {
    User.create({
      username: username,
      email: email,
      password: password
    },(error, result)=>{
      
    })
    const token = jwt.sign({ email }, jwtKey, {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds,
    });
    console.log("token:", token);
    res.cookie("token", token, { maxAge: jwtExpirySeconds * 1000 });
    console.log('cookie sent');
    // res.send('')
    res.render('home',{
      username: username
    });
    
  }
})

router.post('/users/signin', (req, res)=>{
  console.log('hello')
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.render('signin',{error: "Credentials Are Invalid"});
  }
  User.findOne({
    email: email,
    password: password
  },(error, foundUser)=>{
    if(error){
      console.log('error')
      res.redirect('/signin');
    }
    if(foundUser){
      console.log(foundUser);
      res.render('home',{username: foundUser.username, error:""});
    } else{
      
      return res.render('signin',{error: "Either Account Doesn't Exist Or Wrong Credentials"});
    }
  })
})



router.post('/users/chat' ,(req,res) => {
  const username = req.body.username
  const room = req.body.room

  if(!username || !room){
    return res.render('sigin.hbs', { username })
  }
  res.render('home.hbs',{ username, room })
})

module.exports = router


