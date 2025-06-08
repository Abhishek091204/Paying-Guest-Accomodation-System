const mongoose = require("mongoose");

const initData = require("./data.js");

const Listing = require("../models/listing.js");

main().then((res) => {
    console.log("connected to db");
}).catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6841a91db373d94dcc5669e7" }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialised")
}

initDB();