const express = require("express");
const router = express.Router();
const User = require("../../models/Users");
const gravatar = require("gravatar");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

//load input validataion
const validateRegisterInput = require("../../validation/register");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// @route   GET api/users/test
// @desc    Test users route
// @access  Private
router.get("/test", (req, res) => res.json({ msg: "users Works" }));

router.post("/register", (req, res) => {
  console.log("posting register");

  const { errors, isValid } = validateRegisterInput(req.body);

  console.log(`isValid ${isValid}`)
  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists"
      return res.status(400).json(errors);
    } else {
      //Add avatar
      const avatar = gravatar.url(req.body.email, {
        s: "200", //Size
        r: `pg`, //Rating
        d: `mm` //Default
      });

      //Create user
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
        classNumber: 1337,
        cash: 10000
      });


      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post(`/login`, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // find user by email
  User.findOne({ email }).then(user => {
    //check for user
    if (!user) {
      return res.status(404).json({ email: "User email not found!" });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatched => {
      if (isMatched) {
        const payload = {
          id: user.id,
          name: user.name,
          avatar: user.avatar
        };
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              sucess: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res.status(400).json({ password: "password incorrect" });
      }
    });
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {

    // const userWithNoPassword = {
    //   name: "",
    //   email: "",
    //   transaction: [],
    //   watchlist: [],
    //   portfolio: [],
    // }
    // console.log(`password is ${req.user.password}`);
    // console.log(req.user);
    res.json(req.user);
  }
);

module.exports = router;
