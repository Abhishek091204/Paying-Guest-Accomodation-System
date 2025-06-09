const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn ,IsReviewAuthor} = require("../middleware.js");

router.get("/", isLoggedIn, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        });
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    res.redirect(`/listings/${listing._id}`);

}));

router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
    console.log("Review received:", req.body.review); 
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review({
        ...req.body.review,
        author: req.user._id   
    });
    await newReview.save();
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success", "new review created!!");
    res.redirect(`/listings/${listing._id}`);
}));

// DELETE review route
router.delete("/:reviewId",isLoggedIn,IsReviewAuthor,async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted!!");
    res.redirect(`/listings/${id}`);
});

module.exports = router;