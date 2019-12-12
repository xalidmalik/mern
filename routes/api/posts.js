const express = require("express");
const router = express.Router();

// @route   /api/posts
// @desc    posts routing
// @access  public

router.get("/test", (req, res) => res.json({ msg: "Posts work" }));

module.exports = router;
