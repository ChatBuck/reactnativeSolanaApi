const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")
const cors = require("cors")
const axios = require("axios");
const Moralis = require("moralis-v1/node");
require("dotenv").config();

const mountRoutes = require('./routes')

const app = express()
app.use(cors())
app.use(express.json({ limit: '30mb' }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))

mountRoutes(app)

const PORT = process.env.PORT || 5000

const headers = {
    "content-type": "application/json;"
  };

app.get("/", (req, res) => {
    res.send("Testing everything is correct")
    console.log("Testing everything is correct");
})

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
})
