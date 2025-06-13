const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn ,IsReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

router.get("/", isLoggedIn, wrapAsync(reviewController.showReview));

router.post("/", isLoggedIn, wrapAsync(reviewController.createReview));


// DELETE review route
router.delete("/:reviewId",isLoggedIn,IsReviewAuthor,reviewController.deleteReview);

module.exports = router;