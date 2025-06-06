// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const path = require("path")
// const ejsMate = require("ejs-mate");
// app.use(express.urlencoded({ extended: true }));
// const methodOverride = require("method-override");
// app.use(methodOverride("_method"));  //hi
// app.engine('ejs', ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));
// const ExpressError = require("./utils/ExpressError.js")
// const listings = require("./routes/listing.js")
// const reviews = require("./routes/review.js");
// const cookieParser = require("cookie-parser");
// const session = require("express-session");
// const flash=require("connect-flash");

// const sessionOptions = {
//     secret: "mysupersecretcode",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//     }
// };

// app.get("/", (req, res) => {
//     res.send("Hi i am Root")
// });

// app.use(session(sessionOptions));
// app.use(flash());

// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");
// })

// app.use(cookieParser())

// main().then((res) => {
//     console.log("connected to db");
// }).catch((err) => {
//     console.log(err);
// })

// async function main() {
//     await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
// }

// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));

// app.use("/listings", listings);
// app.use("/listings/:id/reviews", reviews);
// // app.get("/testListing", async (req, res) => {
// //     let sampleListing = new Listing({
// //         title: "My new Villa",
// //         description: "By the beach",
// //         price: 1200,
// //         location: "Calangute,Goa",
// //         country: "Bharat",
// //     })
// //     await sampleListing.save();
// //     console.log("sample is saved");
// //     res.send("Successfull");
// // });

// app.all("*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found"));
// })

// app.use((err, req, res, next) => {
//     let { statusCode = 500, message = " something went wrong" } = err;
//     res.status(statusCode).render("error.ejs", { message });
//     // res.status(statusCode).send(message);
// })

// app.get("/getcookies", (req, res) => {
//     res.cookie("greet", "namaste");
//     res.send("send you some cookies");
// })

// app.listen(3000, () => {
//     console.log("Server is listening to port 3000");
// })


// app.js
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
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter=require("./routes/user.js");

// Connect to MongoDB
main().then(() => console.log("connected to db")).catch((err) => console.log(err));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
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
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());

// Flash Middleware
app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student"
    })
    let registeredUser = await User.register(fakeUser, "helloworld")  //password
    res.send(registeredUser);
})
// Routes
app.get("/", (req, res) => {
    res.send("Hi i am Root");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);
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
