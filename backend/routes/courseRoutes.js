const express = require("express");
const {
  createCourse,
  getAllCourses,
  getInstructorCourses,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");
const { roleCheck } = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/", protect, roleCheck("instructor"), createCourse);
router.get("/", protect, getAllCourses);
router.get("/my", protect, roleCheck("instructor"), getInstructorCourses);
router.put("/:id", protect, roleCheck("instructor"), updateCourse);
router.delete("/:id", protect, roleCheck("instructor"), deleteCourse);

module.exports = router;
