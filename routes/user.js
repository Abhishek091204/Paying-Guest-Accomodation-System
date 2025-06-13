const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const user = require("../models/user.js");

// GET: Signup form
router.get("/signup",userController.renderSignupForm);

// POST: Signup logic
router.post("/signup", userController.signUp);

// GET: Login form
router.get("/login", userController.renderLoginForm);

// POST: Login logic
router.post(
    "/login",
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
