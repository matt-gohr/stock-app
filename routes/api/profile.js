const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load user porfile
const Profile = require("../../models/Profile");
const User = require("../../models/Users");

// @route   GET api/us/test
// @desc    Test post route
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route   GET api/profile
// @desc    checks for current users profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "No profile exists for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile
// @desc    checks for current users profile
// @access  Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //get feilds
    const profileFeilds = {};
    profileFeirlds.user = req.user.id;
    if (req.body.handle) profileFeilds.handle = req.body.handle;
    if (req.body.company) profileFeilds.company = req.body.company;
    if (req.body.location) profileFeilds.location = req.body.location;
    if (req.body.bio) profileFeilds.bio = req.body.bio;
    if (req.body.website) profileFeilds.website = req.body.website;
    if (req.body.status) profileFeilds.status = req.body.status;
    
    //skills - split into array
    if(typeof req.body.skills !== 'undefinded'){
        profileFeilds.skills = req.body.skills.split(',')
    }

    //social
    profileFields.social = {};
    if (req.body.youtube) profileFeilds.youtube = req.body.youtube;
    if (req.body.twitter) profileFeilds.twitter = req.body.twitter;
    if (req.body.facebook) profileFeilds.facebookn = req.body.facebookon;
    if (req.body.linkedin) profileFeilds.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFeilds.instagram = req.body.instagram;


    Profile.findOne({ user: req.user.id }).then(profile => {
      //if profile exists then want to update it instead of creating it
      if (!profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFeilds},
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Check if handle exists
        Profile.findOne({ handle: profileFeirlds.handle })
          .then(profile => {
            if (profile) {
              errpors.handle = "That handle already exists";
              res.status(404).json(errors);
            }
            
            new Profile(profileFeilds).save().then(profile => res.json(profile));

          })
      }
    });
  }
);

module.exports = router;
