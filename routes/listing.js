const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, IsOwner, validateListing } = require("../middleware.js");
const listingController= require("../controllers/listings.js");

// Index Route
router.get("/", wrapAsync(listingController.index));

// New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Create Listing
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// Edit Route - show edit form
router.get("/:id/edit", isLoggedIn, IsOwner, wrapAsync(listingController.renderEdit));

// Update Route
router.put("/:id", isLoggedIn, IsOwner, validateListing, wrapAsync(listingController.updateListing));

//Show Route
router.get("/:id", isLoggedIn, wrapAsync(listingController.showListing));

// Delete Route
router.delete("/:id", isLoggedIn, IsOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
