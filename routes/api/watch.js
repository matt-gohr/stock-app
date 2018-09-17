const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => res.json({
    msg: "watchlist Works"
}));

// Lookup all students
router.get("/watch/:id", function (req, res) {
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



// Adds to watch list, takes in student id as param
router.post("/watch/:id", function (req, res) {
    console.log("******** Watch List ************");
    var watchlist = req.body;

    // looks for student id in db.Student and adds ticker to watch list
    db.Student.findOneAndUpdate({
            _id: req.params.id
        }, {
            $push: {
                watchlist: watchlist
            }
        }).then(function (dbStudent) {
            // View the added result in the console
            console.log(dbStudent);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
        });
});


module.exports = router;