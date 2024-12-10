const express = require("express");
const { getParticipant } = require("../controllers/participantController");
const router = express.Router();

router.get("/", getParticipant);

module.exports = router;
