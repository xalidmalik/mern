const express = require("express");
const router = express.Router();

// @route   /api/profile
// @desc    profile routing
// @access  public

router.get("/test", (req, res) => res.json({ msg: "Profile work" }));

module.exports = router;
