if (process.env.NODE_ENV != 'production') {
    require('dotenv').config();
}
console.log(process.env.SECRET)
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const ExpressError = require("./utils/ExpressError.js");
const MongoStore = require("connect-mongo")
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
const dbUrl = process.env.ATLASDB_URL;
// Connect to MongoDB
// main().then(() => console.log("connected to db")).catch((err) => console.log(err));
// async function main() {
//     await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
// }
main().then(() => console.log("connected to db")).catch((err) => console.log(err));
async function main() {
    await mongoose.connect(dbUrl);
}

// App Config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser());

// Session
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
})

store.on("error", (err) => {
    console.log("Error on Mongo Session store", err);
})
const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};


app.use(session(sessionOptions));   //same order
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));  //we define the strategy here then authenticate user
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// Flash Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     })
//     let registeredUser = await User.register(fakeUser, "helloworld")  //password
//     res.send(registeredUser);
// })
// Routes
// app.get("/", (req, res) => {
//     res.send("Hi i am Root");
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
// Test route
app.get("/test", (req, res) => {
    res.send("Test route working");
});

// Cookie Test
app.get("/getcookies", (req, res) => {
    res.cookie("greet", "namaste");
    res.send("send you some cookies");
});

// 404 Handler
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

// Error Handler
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// Start Server
app.listen(3000, () => {
    console.log("Server is listening to port 3000");
});
