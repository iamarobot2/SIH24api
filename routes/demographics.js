const express = require("express");
const { getDemographics } = require("../controllers/demographicsCon troller");
const router = express.Router();

router.get("/", getDemographics);

module.exports = router;
