const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    image: {
        filename: { type: String, default: "default-image.jpg" },
        url: {
            type: String,
            default: "https://manage.isleblue.co/uploads/villas/images/1746/bvis-villa-on-the-beach-2019-header_large.jpg",
            set: (v) => v === "" ? "https://manage.isleblue.co/uploads/villas/images/1746/bvis-villa-on-the-beach-2019-header_large.jpg" : v
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
});

listingSchema.post('findOneAndDelete', async function (listing) {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

