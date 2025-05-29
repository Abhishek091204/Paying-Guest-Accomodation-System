const express=require("express")
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { listingSchema } = require("../schema.js")
const Listing = require("../models/listing.js");


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
//Index Route
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
})

router.post("/", validateListing, wrapAsync(async (req, res) => {
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
router.get("/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
})

//update route
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}))

router.delete("/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

module.exports=router;