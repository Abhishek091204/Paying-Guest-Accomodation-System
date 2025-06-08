const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, IsOwner,validateListing } = require("../middleware.js");



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
    const newListing = new Listing(req.body.listing);
    // Since owner is an array in schema, assign as array with one ObjectId
    newListing.owner = [req.user._id];
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}));

// Edit Route - show edit form
router.get("/:id/edit", isLoggedIn, IsOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

// Update Route
router.put("/:id", isLoggedIn, IsOwner, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;

    // Update listing with new data
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (!updatedListing) {
        throw new ExpressError(404, "Listing not found");
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}));

// Show Route - show details for one listing
router.get("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

// Delete Route
router.delete("/:id", isLoggedIn, IsOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

module.exports = router;
