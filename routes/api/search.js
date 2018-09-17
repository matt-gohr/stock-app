const express = require("express");
const router = express.Router();
const axios =  require("axios");

// @route   GET api/posts/test
// @desc    Test post route
// @access  Public
router.get("/test", (req, res) => res.json({
    msg: "Search Works"
}));

// Lookup all students
router.get("/search", function (req, res) {
    console.log(req.query);
    var parameters = {
        symbols: req.query.symbols,
        types: req.query.types,
        range: req.query.range,
        last: req.query.last
    }
    axios({
            method: 'GET',
            url: 'https://api.iextrading.com/1.0//stock/market/batch',
            params: parameters,
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
        .then(function (response) {
            // console.log(response.data);
            res.json(response.data);
        });
});

// Lookup all students
router.get("/list", function (req, res) {
    console.log(req.query);
    var parameters = {
        symbols: req.query.symbols,
        types: req.query.types,
        range: req.query.range,
        last: req.query.last
    }
    axios({
        method: 'GET',
        url: 'https://api.iextrading.com/1.0//stock/market/list',
        params: parameters,
        headers: {
            'Cache-Control': 'no-cache'
        }
    })
        .then(function (response) {
            console.log(response.data);
            res.json(response.data);
        });
});

module.exports = router;