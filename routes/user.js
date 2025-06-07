const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

// GET: Signup form
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// POST: Signup logic
router.post("/signup", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash("success", "User registered successfully");
            const redirectUrl = req.session.redirectUrl || "/listings";
            delete req.session.redirectUrl;
            res.redirect(redirectUrl);
        });
    } catch (err) {
        console.log(err);
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

// GET: Login form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// POST: Login logic
router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    (req, res) => {
        req.flash("success", "Welcome to WanderLust! You are logged in!");
        const redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    }
);

// GET: Logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        req.flash("success", "You are logged out now");
        res.redirect("/listings");
    });
});

module.exports = router;
