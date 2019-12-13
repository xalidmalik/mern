const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Post Model
const Post = require("../../models/Posts");
// Load Profile Model
const Profile = require("../../models/Profile");

// @route   /api/posts
// @desc    posts routing
// @access  public

router.get("/test", (req, res) => res.json({ msg: "Posts work" }));

// @route   GET /api/posts
// @desc    Get posts
// @access  Public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(post => res.json(post))
    .catch(err => res.status(404).json(err));
});

// @route   GET /api/posts/:id
// @desc    Get posts by id
// @access  Public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json(err));
});

// @route   POST /api/posts
// @desc    Create post
// @access  Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE /api/posts/:id
// @desc    Delete post by ID
// @access  Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: "Kullanıcı kayıtlı değil" });
          }
          //Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err =>
          res.status(404).json({ postnotfound: "Post bulunamadı" })
        );
    });
  }
);

module.exports = router;
