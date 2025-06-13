const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, IsOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer")
const { storage } = require("../cloudConfig.js")
// const upload = multer({ dest: "uploads/" })
const upload = multer({ storage });


router.route("/")
    // Index Route
    .get(wrapAsync(listingController.index))
    // Create Listing
    .post(isLoggedIn, upload.single('image'), validateListing, wrapAsync(listingController.createListing));

// New Listing Form
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
    // Update Route
    .put(isLoggedIn, IsOwner, upload.single('image'), validateListing, wrapAsync(listingController.updateListing))
    //Show Route
    .get(isLoggedIn, wrapAsync(listingController.showListing))
    // Delete Route
    .delete(isLoggedIn, IsOwner, wrapAsync(listingController.destroyListing));

// Edit Route - show edit form
router.get("/:id/edit", isLoggedIn, IsOwner, wrapAsync(listingController.renderEdit));

module.exports = router;
