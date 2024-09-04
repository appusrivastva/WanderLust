const express = require("express");

const router = express.Router();

const ExpressError = require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/user_controller.js")
// get /signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(userController.signup)

// get /login

router.route("/login")
.get((req, res) => {
  res.render("users/login.ejs");
})
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(userController.login)
);


router.get("/logout",userController.logout)

module.exports = router;
