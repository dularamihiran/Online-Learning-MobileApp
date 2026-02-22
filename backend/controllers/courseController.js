const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.createCourse = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      content, 
      category, 
      level, 
      duration, 
      price, 
      prerequisites, 
      learningOutcomes 
    } = req.body;

    const course = await Course.create({
      title,
      description,
      content,
      category,
      level,
      duration,
      price,
      prerequisites,
      learningOutcomes,
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

exports.getInstructorStats = async (req, res) => {
  try {
    // Get total courses created by instructor
    const totalCourses = await Course.countDocuments({ instructor: req.user._id });

    // Get total students enrolled in instructor's courses
    const instructorCourses = await Course.find({ instructor: req.user._id }).select('_id');
    const courseIds = instructorCourses.map(course => course._id);
    
    const totalStudents = await Enrollment.distinct('student', { course: { $in: courseIds } });

    res.json({
      totalCourses,
      totalStudents: totalStudents.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
