const express = require("express");
const router = express.Router();

// @route   GET api/us/test
// @desc    Test post route
// @access  Private
router.get("/test", (req, res) => res.json({
    msg: "students Works"
}));

// Create new student (currently using dummy data)
router.post("/students", function (req, res) {
    console.log("Adding new student");
    var student = {
        studentName: "John J. Schmit",
        firstName: "John",
        lastName: "Schmit",
        classNumber: 1337,
        cash: 10000
    }
    db.Student.create(student)
        .then(function (dbStudent) {
            // View the added result in the console
            return console.log(dbStudent);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
        });
})

// Lookup all students
router.get("/students", function (req, res) {
    // Lookup all students. To filter by class, add a function here
    db.Student.find({}).sort({
            "_id": -1
        })
        .then(function (dbStudent) {
            res.json(dbStudent);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

module.exports = router;