const { Router } = require("express");
const homeController = require("../controllers/homeController");
const { ensureAuthenticated } = require("../auth");
const multer = require("multer");
const path = require("path");
const UPLOAD_PATH = path.resolve(__dirname, "../audio-uploads");
const upload = multer({
  dest: UPLOAD_PATH,
  limits: {
    fileSize: 10000000,
    files: 2,
  },
});

const router = Router();

router.get("/home", ensureAuthenticated, homeController.home_get);

router.get("/profile", ensureAuthenticated, homeController.profile_get);

router.get("/about", ensureAuthenticated, homeController.about_get);

router.get("/profile/:id", ensureAuthenticated, homeController.profileSpecific_get);

router.get("/playlists", ensureAuthenticated, homeController.playlists_get);

router.get("/search", ensureAuthenticated, homeController.search_get);

router.post("/search", ensureAuthenticated, homeController.search_post);


router.post(
  "/create-post",
  upload.fields([
    { name: "musicFile", maxCount: 1 },
    { name: "imageFile", maxCount: 1 },
  ]),
  homeController.createPost_post
);

router.get("/load-posts", ensureAuthenticated, homeController.loadPosts_post);

router.post("/add-to-playlist", ensureAuthenticated, homeController.addPlaylist_post);

router.get("/load-playlist",ensureAuthenticated, homeController.loadPlaylist_get)

router.get("/load-playlist/:id", ensureAuthenticated, homeController.loadOtherPlaylist_get)

router.post("/delete-playlist", ensureAuthenticated, homeController.deletePlaylist_post)

router.post("/load-search", ensureAuthenticated, homeController.loadSearch_post);

router.get("/post-music/:id", ensureAuthenticated, homeController.uploadPostMusic_get);

router.get("/post-photo/:id", ensureAuthenticated, homeController.uploadPostPhoto_get);

//router.post("/login", authController.login_post);

module.exports = router;
