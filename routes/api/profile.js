const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile model
const Profile = require("../../models/Profile");

// Load User model
const User = require("../../models/Users");

// @route   /api/profile
// @desc    profile routing
// @access  public

router.get("/test", (req, res) => res.json({ msg: "Profile work" }));

// @route   GET /api/profile
// @desc    Get current users profile
// @access  Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar", "email"])
      .then(profile => {
        if (!profile) {
          return res.status(404).json({ noprofile: "Kullanıcı bulunamadı" });
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST /api/profile
// @desc    Create users profile
// @access  Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Get fields
    const profilefields = {};
    profilefields.user = req.user.id;
    if (req.body.handle) profilefields.handle = req.body.handle;
    if (req.body.company) profilefields.company = req.body.company;
    if (req.body.website) profilefields.website = req.body.website;
    if (req.body.location) profilefields.location = req.body.location;
    if (req.body.bio) profilefields.bio = req.body.bio;
    if (req.body.status) profilefields.status = req.body.status;
    if (req.body.githubusername)
      profilefields.githubusername = req.body.githubusername;
    //skills Split array
    if (typeof req.body.skills !== "undefined") {
      profilefields.skills = req.body.skills.split(",");
    }
    //Social
    profilefields.social = {};
    if (req.body.youtube) profilefields.social.youtube = req.body.youtube;
    if (req.body.twitter) profilefields.social.twitter = req.body.twitter;
    if (req.body.linkedin) profilefields.social.youtube = req.body.youtube;
    if (req.body.facebook) profilefields.social.facebook = req.body.facebook;
    if (req.body.instagram) profilefields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profilefields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //Create

        //Check if handle
        Profile.findOne({ handle: profilefields.handle }).then(profile => {
          if (profile) {
            res.status(400).json({ handle: "Bu profil mevcut" });
          }

          //Save Profile
          new Profile(profilefields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

module.exports = router;
