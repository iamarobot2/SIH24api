const express = require("express");
const {
  claimMeal,
  resetMealClaim,
  checkMealClaim,
} = require("../controllers/mealClaimsController");
const router = express.Router();

router.post("/claimMeal", claimMeal);
router.post("/resetMealClaim", resetMealClaim);
router.get("/checkMealClaim", checkMealClaim);

module.exports = router;
