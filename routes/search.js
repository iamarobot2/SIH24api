const express = require("express");
const { searchParticipants, searchTeams } = require("../controllers/searchController");
const router = express.Router();

router.get("/searchParticipants", searchParticipants);
router.get("/searchTeams", searchTeams);

module.exports = router;