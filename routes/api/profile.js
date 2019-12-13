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

// @route   POST /api/profile/all
// @desc    Get all profile
// @access  Public

router.get("/all", (req, res) => {
  Profile.find()
    .populate("user", ["name", "avatar", "email"])
    .then(profiles => {
      if (!profiles) {
        res.status(404).json({ noprofile: "Profil bulunamadı" });
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST /api/profile/handle/:handle
// @desc    Get profile by handle
// @access  Public

router.get("/handle/:handle", (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar", "email"])
    .then(profile => {
      if (!profile) {
        res.status(404).json({ noprofile: "Kullanıcı bulunamadı" });
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   POST /api/profile/user/:user_id
// @desc    Get profile by ID
// @access  Public

router.get("/user/:user_id", (req, res) => {
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar", "email"])
    .then(profile => {
      if (!profile) {
        res.status(404).json({ noprofile: "Kullanıcı bulunamadı" });
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({ noprofile: "Kullanıcı bulunamadı" }));
});

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

// @route   POST /api/profile/experience
// @desc    Add experience profile
// @access  Private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to exp array
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   POST /api/profile/experience
// @desc    Add experience profile
// @access  Private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to exp array
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   DELETE /api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      //Get remove index
      const removeIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      // Splice out of array
      profile.experience.splice(removeIndex, 1);

      // Save

      profile
        .save()
        .then(profile =>
          res.json(profile).catch(err => res.status(404).json(err))
        );
    });
  }
);

// @route   DELETE /api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      //Get remove index
      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      // Splice out of array
      profile.education.splice(removeIndex, 1);

      // Save

      profile
        .save()
        .then(profile =>
          res.json(profile).catch(err => res.status(404).json(err))
        );
    });
  }
);

// @route   DELETE /api/profile
// @desc    Delete user and profile
// @access  Private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findByIdAndRemove({ _id: req.user.id }).then(() => {
        res.json({ success: true });
      });
    });
  }
);

module.exports = router;
