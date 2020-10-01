const { Router } = require("express");
const profileController = require("../controllers/profileController");
const { ensureAuthenticated } = require("../auth");
const multer = require("multer");
const path = require("path");
const UPLOAD_PATH = path.resolve(__dirname, "../uploads");
const upload = multer({
  dest: UPLOAD_PATH,
  limits: {
    fileSize: 10000000,
    files: 2,
  },
});


const router = Router();

router.get("/following", ensureAuthenticated, profileController.following_get);

router.get("/followers", ensureAuthenticated, profileController.followers_get);

router.post("/edit-about/:id", ensureAuthenticated, profileController.edit_about_post);

router.get("/edit-about/:id", ensureAuthenticated, profileController.edit_about_get);

router.get("/load-my-posts", ensureAuthenticated, profileController.loadMyPosts_post);

router.get("/load-other-profile-posts/:id", ensureAuthenticated, profileController.loadOtherProfilePosts_get);
//router.post("/login", authController.login_post);

router.post("/upload-photo/:id", upload.single("img"), profileController.uploadPhoto_post);

router.post("/upload-cover-photo/:id", upload.single("imgCover"), profileController.uploadCoverPhoto_post);

router.get("/cover-photo/:id", ensureAuthenticated, profileController.uploadCoverPhoto_get);

router.get("/photo/:id", ensureAuthenticated,profileController.uploadPhoto_get);

module.exports = router;
