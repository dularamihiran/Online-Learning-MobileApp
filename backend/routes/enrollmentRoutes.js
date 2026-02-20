const express = require("express");
const {
  enrollCourse,
  getMyEnrollments,
  getCourseStudents
} = require("../controllers/enrollmentController");

const { protect } = require("../middleware/authMiddleware");
const { roleCheck } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/enroll", protect, roleCheck("student"), enrollCourse);
router.get("/my", protect, roleCheck("student"), getMyEnrollments);
router.get("/course/:courseId", protect, roleCheck("instructor"), getCourseStudents);

module.exports = router;
