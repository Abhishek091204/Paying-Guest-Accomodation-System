const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    // image: {
    //     type: String,
    //     default: "https://in.images.search.yahoo.com/images/view;_ylt=AwrKEYOxR7lnk7o5WCS9HAx.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkAzM0NDNjY2UzNWE0NjU5N2Y5MzI3MWEyYmMzN2M0ODdjBGdwb3MDMgRpdANiaW5n?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Dvilla%2Bimages%2Bof%2Bbeach%26type%3DE210IN826G0%26fr%3Dmcafee%26fr2%3Dpiv-web%26tab%3Dorganic%26ri%3D2&w=1920&h=1078&imgurl=manage.isleblue.co%2Fuploads%2Fvillas%2Fimages%2F1746%2Fbvis-villa-on-the-beach-2019-header_large.jpg&rurl=https%3A%2F%2Fisleblue.co%2Fvillas%2Fvacation-rentals%2Fcaribbean%2Fbvis%2Fmahoe-bay-virgin-gorda%2Fa-villa-on-the-beach&size=587KB&p=villa+images+of+beach&oid=3443cce35a46597f93271a2bc37c487c&fr2=piv-web&fr=mcafee&tt=A+Villa+on+the+Beach+-+villa+A+Villa+on+the+Beach+BVIs+%7C+Isle+Blue&b=0&ni=21&no=2&ts=&tab=organic&sigr=VsgysnjvaF.a&sigb=MNJBTkA8SsY2&sigi=fr3ouArE7SUD&sigt=Sn3gvT_Uh43z&.crumb=fVsnnNa8.oK&fr=mcafee&fr2=piv-web&type=E210IN826G0",
    //     set: (v) => v === "" ? "https://in.images.search.yahoo.com/images/view;_ylt=AwrKEYOxR7lnk7o5WCS9HAx.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkAzM0NDNjY2UzNWE0NjU5N2Y5MzI3MWEyYmMzN2M0ODdjBGdwb3MDMgRpdANiaW5n?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Dvilla%2Bimages%2Bof%2Bbeach%26type%3DE210IN826G0%26fr%3Dmcafee%26fr2%3Dpiv-web%26tab%3Dorganic%26ri%3D2&w=1920&h=1078&imgurl=manage.isleblue.co%2Fuploads%2Fvillas%2Fimages%2F1746%2Fbvis-villa-on-the-beach-2019-header_large.jpg&rurl=https%3A%2F%2Fisleblue.co%2Fvillas%2Fvacation-rentals%2Fcaribbean%2Fbvis%2Fmahoe-bay-virgin-gorda%2Fa-villa-on-the-beach&size=587KB&p=villa+images+of+beach&oid=3443cce35a46597f93271a2bc37c487c&fr2=piv-web&fr=mcafee&tt=A+Villa+on+the+Beach+-+villa+A+Villa+on+the+Beach+BVIs+%7C+Isle+Blue&b=0&ni=21&no=2&ts=&tab=organic&sigr=VsgysnjvaF.a&sigb=MNJBTkA8SsY2&sigi=fr3ouArE7SUD&sigt=Sn3gvT_Uh43z&.crumb=fVsnnNa8.oK&fr=mcafee&fr2=piv-web&type=E210IN826G0" : v,
    //     url:String,
    // },
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
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;

