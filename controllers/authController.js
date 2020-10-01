const User = require("../models/users");
const bcrypt = require("bcrypt");
const session = require("express-session");
const express = require("express");
const LocalStrategy = require("passport-local").Strategy;

const initializePassport = require("../passport-config");
const passport = require("passport");
const { model } = require("../models/users");
initializePassport(passport, (username) => {
  return User.find((user) => user.username == username);
});

const app = express();

app.use(session({
  secret: "very secret",
  resave: false,
  saveUninitialized: true,
  cookie:{
      maxAge: 1000 * 60 * 60
  }
}))


//REGISTER.GET
module.exports.register_get = (req, res) => {
 res.render("register.ejs");
};

//LOGIN.GET
module.exports.login_get = (req, res) => {
  
  if (req.session.user){
    res.redirect("/home");
    
  } else{
    res.render("login.ejs");
  }
  
};

//LOGOUT.GET
module.exports.logout_get = (req, res) => {
  res.clearCookie("user");
  req.logout();
  res.redirect("/");
};

//REGISTER.POST
module.exports.register_post = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    const password = await bcrypt.hash(req.body.password, 10);
    const user = await new User({
      //Media
      profileImage: "4fcd420c534df57ac8c16745e34f5fc6",
      coverImage: "58b4e3a03b12e8731c30520fa38b0b6a",

      //Account information
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: password,

      //About
      birthday: "",
      gender: "",
      city: "",

      //Arrays
      posts: [],
      playlists: [],
      favoritePlaylists: [],
      followedPlaylists: [],
      followingPeople: [],
      followedPeople: [],
    });

      user
        .save()
        .then((result) => {
          message: "Registration Success";
          res.send(result);
        })
        .catch((err) => console.log(err));
      res.redirect("/login");
  
  } catch (err) {
    console.log(err);
    res.status(400).send("error, user not created");
    message: "Error, user not created."
  }
};

//LOGIN.POST
module.exports.login_post = passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/login",
  failureFlash: true,
});

// module.exports.login_post = (req, res) => {
//   req.session.username = req.body.username;
//   res.redirect("/login")
// }


module.exports.home_get = (req, res) => {
    res.redirect("/home")
}