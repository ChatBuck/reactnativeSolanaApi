const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello this is test")
    console.log("Hello this is test");
})

router.get("/person1", (req, res) => {
    console.log("person1");
    res.send("person1")
})

router.get("/person2", (req, res) => {
    console.log("person2");
    res.send("person1")
})

module.exports = router;