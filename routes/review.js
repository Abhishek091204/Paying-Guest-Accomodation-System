const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
// const { validateReview} = require("../schema.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview}=require("../middleware.js");
//reviews
//post route
router.post("/", validateReview, wrapAsync(async (req, res) => {
    console.log("Review received:", req.body.review); // Add this line

    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);     // Should have rating & comment
    await newReview.save();
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success","new review created!!");
    res.redirect(`/listings/${listing._id}`);
}));

// DELETE review route
router.delete("/:reviewId", async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted!!");
    res.redirect(`/listings/${id}`);
});

module.exports = router;