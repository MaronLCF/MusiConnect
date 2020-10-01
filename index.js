if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const session = require("express-session");
const bodyparser = require("body-parser");
const cookieparser = require("cookie-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const multer = require("multer");
const fs = require("fs");
const MongoClient = require("mongodb").MongoClient;

const User = require("./models/users");
const Post = require("./models/posts");
require("./passport-config");

const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/homeRoutes");
const profileRoutes = require("./routes/profileRoutes");
const path = require("path");


const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyparser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyparser.json());

const urlencoder = bodyparser.urlencoded({
  extended: false
})

app.use(cookieparser());

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(
  session({
    secret: "very secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.set("view engine", "ejs");

//Connect to mongoDB
const dbURI = "mongodb+srv://user1:cisco@apdevmp.me8jb.mongodb.net/musiconnect?retryWrites=true&w=majority";
const DATABASE_NAME = "musiconnect";
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) =>
   app.listen(process.env.PORT || 3000, () => {
    MongoClient.connect(dbURI, { useNewUrlParser: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        posts = database.collection("posts");
        users = database.collection("users");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
})
  )
  .catch((err) => console.log(err));

app.use(authRoutes);

app.use(homeRoutes);

app.use(profileRoutes);
