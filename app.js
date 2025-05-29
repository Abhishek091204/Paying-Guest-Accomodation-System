const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path")
const ejsMate = require("ejs-mate");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));  //hi
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const ExpressError = require("./utils/ExpressError.js")
const listings=require("./routes/listing.js")
const reviews=require("./routes/review.js");

main().then((res) => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute,Goa",
//         country: "Bharat",
//     })
//     await sampleListing.save();
//     console.log("sample is saved");
//     res.send("Successfull");
// });

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = " something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
    // res.status(statusCode).send(message);
})

app.get("/", (req, res) => {
    res.send("Hi i am Root")
});















app.listen(3000, () => {
    console.log("Server is listening to port 3000");
})