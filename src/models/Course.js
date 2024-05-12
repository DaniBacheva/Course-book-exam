const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        minLength:[5, "Title is too short"],
    },
    type: {
        type: String,
        required: [true, "Type is required"],
        minLength:[3, "Type is too short"],

    },
    certificate: {
        type: String,
        required: [true, "Certificate is required"],
        minLength:[2, "Certificate is too short"],
    },
    image: {
        type: String,
        required: [true, "Image is required"],
        minLength:[10, "Image URL is too short"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minLength:[10, "Description is too short"],
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        minLength:[0, "Price must be positive number"],
    },
    signUpList: [{
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    ],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    }
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;


