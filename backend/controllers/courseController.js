const Course = require("../models/Course");

exports.createCourse = async (req, res) => {
  try {
    const { title, description, content } = req.body;

    const course = await Course.create({
      title,
      description,
      content,
      instructor: req.user._id
    });

    res.status(201).json(course);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    Object.assign(course, req.body);
    await course.save();

    res.json(course);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
