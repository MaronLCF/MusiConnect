const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

router.get("/register", notAuthenticate,authController.register_get);

router.get("/login", notAuthenticate,authController.login_get);

router.post("/register", notAuthenticate,authController.register_post);

router.post("/login", notAuthenticate,authController.login_post);

router.get("/logout", authController.logout_get);

router.get("/", authController.home_get);


function notAuthenticate (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
     }
    req.flash("error_msg", "Already logged in")
    res.redirect("/home")
 }

    

module.exports = router;
