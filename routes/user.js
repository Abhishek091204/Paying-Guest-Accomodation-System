const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const user = require("../models/user.js");

router.route("/signup")
    // GET: Signup form
    .get(userController.renderSignupForm)
    // POST: Signup logic
    .post(userController.signUp);


router.route("/login")
    // GET: Login form
    .get(userController.renderLoginForm)
    // POST: Login logic
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login
    );

// GET: Logout
router.get("/logout", userController.logout);

module.exports = router;
