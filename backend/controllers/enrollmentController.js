const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    console.log('Enroll request:', { courseId, student: req.user?._id });

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId
    });

    console.log('Enrollment successful:', enrollment);

    res.status(201).json({
      message: "Enrollment successful",
      enrollment
    });

  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id
    }).populate("course");

    res.json(enrollments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCourseStudents = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      course: req.params.courseId
    }).populate("student", "name email");

    res.json(enrollments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
