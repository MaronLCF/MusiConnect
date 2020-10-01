const User = require("../models/users");
const Post = require("../models/posts");
const { db } = require("../models/posts");
const fs = require("fs");
const path = require("path");
const { unsubscribe } = require("../routes/homeRoutes");
const UPLOADED_PATH = path.resolve(__dirname, "../audio-uploads");



module.exports.home_get = (req, res) => {
      var uname = req.user.username;
      var pword = req.user.password;
    // check if client sent cookie
      // no: set a new cookie
      res.cookie('user', uname, { 
        maxAge: 900000, httpOnly: true 
      });

  res.render("home.ejs",{ user: req.user });
};

module.exports.loadPosts_post = async  (req, res) => {
res.send({ posts: await Post.find().sort({createdAt: -1}), user: req.user });
}

module.exports.addPlaylist_post = async (req, res) => {
  var postID = req.body.postID;
  var userID = req.user.id

  console.log(req.body.music)
  try {
    User.findOne({ _id: userID }, function (err, document) {
      if (document) {
        document.playlists.push({
          _id: postID,
          author: req.body.author,
          photo: req.body.photo,
          music: req.body.music,
          title: req.body.title,
          description: req.body.description,
        })
        document.save(function (err) {
          err != null ? console.log(err) : console.log('Data updated')
        })
      }
    })
    res.send("Successfully added to playlist")
  } catch (error) {
    res.send("error")
  }
}

module.exports.loadPlaylist_get = async( req, res) => {
    res.send({ user: await User.find({ _id: req.user.id }) });
}

module.exports.loadOtherPlaylist_get = async (req, res) => {
  res.send({ user: await User.find({ _id: req.params.id}) });
}


module.exports.deletePlaylist_post = async(req, res) => {
  var postID = req.body.postID;
  var userID = req.user.id

  try {
    User.findOne({ _id: userID }, function (err, document) {
      if (document) {
        document.playlists.pull({
          _id: postID,
        })
        document.save(function (err) {
          err != null ? console.log(err) : console.log('Data updated')
        })
      }
    })
    res.send("Successfully removed from playlist")
  } catch (error) {
    res.send("error")
  }
}

module.exports.loadSearch_post = async (req, res) => {
  res.send({
    user: await User.find({
      username: req.body.searchName}) })
}

module.exports.createPost_post = async (req,res) => {
  console.log("Music: " + req.files.musicFile[0].filename);
   console.log("Image: " + req.files.imageFile[0].filename);
  var desc1 = req.body.description;
  var title1 = req.body.title;
  var author1 = req.user.username;
  var music = req.files.musicFile[0].filename;
   try {
     const post = await new Post({
       authorID: req.user.id,
       author: author1,
       title: title1,
       description: desc1,
       photo: req.files.imageFile[0].filename,
       favoriteCount: 0,
       musicLink: music,
       comments: [],
     });

     post.save().then((result) => {
       message: "Post Success";
       res.redirect('home');
     });
   } catch (err) {
     console.log(err);
   }
}

module.exports.uploadPostMusic_get = (req, res) => {
  Post.findOne({ musicLink: req.params.id }).then(
    (doc) => {
      fs.createReadStream(path.resolve(UPLOADED_PATH, doc.musicLink)).pipe(res);
    },
    (err) => {
      console.log(err);
      res.sendStatus(404);
    }
  );
}

module.exports.uploadPostPhoto_get = (req, res) => {
  Post.findOne({ photo: req.params.id }).then(
    (doc) => {
      fs.createReadStream(path.resolve(UPLOADED_PATH, doc.photo)).pipe(res);
    },
    (err) => {
      console.log(err);
      res.sendStatus(404);
    }
  );
};

module.exports.profile_get = (req, res) => {
  res.render("profile.ejs", { user: req.user });
};

module.exports.profileSpecific_get =  async (req, res) => {
  res.render("profile-specific.ejs", { user: await User.findOne({ _id: req.params.id }), currentUser: req.user.id });
};


module.exports.playlists_get = (req, res) => {
  res.render("playlists.ejs", { user: req.user });
};

module.exports.search_get = (req, res) => {
};

module.exports.search_post = (req, res) => {
  console.log(req.body.searchName)
  res.render("search_tab.ejs", { user: req.user,search: req.body.search });
};

module.exports.about_get = (req, res) => {
  res.render("aboutus.ejs")
}
