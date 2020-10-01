const User = require("../models/users");
const Post = require("../models/posts");
const fs = require("fs");
const path = require("path");
const UPLOADED_PATH = path.resolve(__dirname, "../uploads");


module.exports.followers_get = (req, res) => {
  res.render("followers.ejs", { user: req.user });
};

module.exports.following_get = (req, res) => {
  res.render("following.ejs", { user: req.user });
};

module.exports.loadMyPosts_post = async (req, res) => {
  res.send({ posts: await Post.find({ author: req.user.username }).sort({ createdAt: -1 }) });
};

module.exports.loadOtherProfilePosts_get = async (req, res) => {
  console.log(req.params.id);
  res.send({ posts: await Post.find({ authorID: req.params.id }).sort({ createdAt: -1 }) });
};


module.exports.edit_about_get = (req, res, next) => {
  User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, (err, docs)=>{
    if(err){
      console.log("Cannot retrieve data  and edit  because of some database problem")
      next(err)
    } else{
      res.render("edit-about.ejs", { user: docs })
    }
  })
  
}

module.exports.edit_about_post = (req,res, next) => {
  User.findByIdAndUpdate({_id: req.params.id}, req.body, (err, docs) => {
    if(err){
      console.log("error")
      next(err)
    } else{
      res.redirect("/profile")
    }
  })
}


module.exports.uploadPhoto_post = (req, res) => {
    console.log(req.file.filename);
    console.log(req.params.id);
    User.findByIdAndUpdate({ _id: req.params.id }, { profileImage: req.file.filename }, (err, docs) => {
      if (err) {
        console.log("error");
        next(err);
      } else {
        res.redirect("/profile");
      }
    });
};

module.exports.uploadCoverPhoto_post = (req, res) => {
  console.log(req.file.filename);
  User.findByIdAndUpdate({ _id: req.params.id }, { coverImage: req.file.filename }, (err, docs) => {
    if (err) {
      console.log("error");
      next(err);
    } else {
      console.log("Success")
      res.redirect("/profile");
    }
  });
};

module.exports.uploadCoverPhoto_get = (req, res) => {
  User.findOne({ _id: req.params.id }).then(
    (doc) => {
      fs.createReadStream(path.resolve(UPLOADED_PATH, doc.coverImage)).pipe(res);
    },
    (err) => {
      console.log(err);
      res.sendStatus(404);
    }
  );
};

module.exports.uploadPhoto_get = (req, res) => {
  User.findOne({ _id: req.params.id }).then(
    (doc) => {
      fs.createReadStream(path.resolve(UPLOADED_PATH, doc.profileImage)).pipe(res);
    },
    (err) => {
      console.log(err);
      res.sendStatus(404);
    }
  );
};
