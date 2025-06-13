const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.showReview = async (req, res) => {
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
};

module.exports.createReview = async (req, res) => {
    console.log("Review received:", req.body.review);
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review({
        ...req.body.review,
        author: req.user._id // ✅ correctly set before save
    });
    await newReview.save(); // ✅ don't reassign after this
    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success", "new review created!!");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted!!");
    res.redirect(`/listings/${id}`);
}