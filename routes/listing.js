const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// New Listing Form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

// Create Listing
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newData = new Listing(req.body.listing);
    await newData.save();
    req.flash("success", "New listing created!!");
    res.redirect("/listings");
}));


// Edit Route - show edit form
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
    }
    res.render("listings/edit.ejs", { listing });
}));

// Update Route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    if (!updatedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}));

// Show Route - show details for one listing
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "listing not found");
        return res.redirect("/listings"); // ✅ ADD return here
    }
    res.render("listings/show.ejs", { listing });
}));


// Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

module.exports = router;
