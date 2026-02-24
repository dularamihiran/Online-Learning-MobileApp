const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  category: {
    type: String,
    default: "Other"
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner"
  },
  duration: {
    type: String,
    default: "Self-paced"
  },
  price: {
    type: String,
    default: "Free"
  },
  prerequisites: {
    type: String,
    default: "None"
  },
  learningOutcomes: {
    type: String,
    default: ""
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);
