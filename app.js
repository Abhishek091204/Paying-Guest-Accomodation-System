const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path")
const ejsMate = require("ejs-mate");
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { listingSchema } = require("./schema.js")





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

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

app.post("/listings", validateListing, wrapAsync(async (req, res) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    // if(!req.body.listing){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    if (result.error) {
        throw new ExpressError(400, result.errpr)
    }
    const newData = new Listing(req.body.listing);
    // if(!newData.title){
    //     throw new ExpressError(400,"title is missing!")
    // }
    // if(!newData.description){
    //     throw new ExpressError(400,"Description is missing!")
    // }
    // if(!newData.location){
    //     throw new ExpressError(400,"location is missing!")
    // }
    await newData.save();
    res.redirect("/listings");
}));


//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
})

//update route
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
})

app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

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