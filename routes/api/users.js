const express = require("express");
const router = express.Router();

// @route   /api/users
// @desc    users routing
// @access  public

router.get("/test", (req, res) => res.json({ msg: "Users work" }));

module.exports = router;
