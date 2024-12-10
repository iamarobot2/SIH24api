const { getDB } = require("../config/db");

const claimMeal = async (req, res) => {
  try {
    const { participant, mealType } = req.body;
    if (!participant || !mealType) {
      return res
        .status(400)
        .json({ message: "Participant and meal type are required" });
    }
    const database = getDB();
    const claimsCollection = database.collection("mealClaims");
    const currentDate = new Date().toISOString().split("T")[0];
    const existingClaim = await claimsCollection.findOne({
      "participant.participantId": participant.participantId,
      mealType,
      date: currentDate,
    });
    if (existingClaim) {
      return res.status(400).json({
        message: `${existingClaim.participant.name} has already claimed ${mealType} for today`,
      });
    }
    await claimsCollection.insertOne({
      participant,
      mealType,
      date: currentDate,
      claimedAt: new Date(),
    });
    res.status(200).json({ message: `${mealType} claimed successfully` });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error(error);
  }
};

const resetMealClaim = async (req, res) => {
  try {
    const { participant, mealType } = req.body;
    if (!participant || !mealType) {
      return res
        .status(400)
        .json({ message: "Participant and meal type are required" });
    }
    const database = getDB();
    const claimsCollection = database.collection("mealClaims");
    const currentDate = new Date().toISOString().split("T")[0];
    const result = await claimsCollection.deleteOne({
      "participant.participantId": participant.participantId,
      mealType,
      date: currentDate,
    });
    if (result.deletedCount === 0) {
      return res.status(400).json({ message: "No meal claim found to reset" });
    }
    res.status(200).json({ message: "Meal claim reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error(error);
  }
};

const checkMealClaim = async (req, res) => {
  if (req.method === "GET") {
    try {
      const { participantId, mealType } = req.query;
      if (!participantId || !mealType) {
        return res
          .status(400)
          .json({ message: "Participant ID and meal type are required" });
      }
      const database = getDB();
      const claims = database.collection("mealClaims");
      const currentDate = new Date().toISOString().split("T")[0];

      const existingClaim = await claims.findOne({
        "participant.participantId": participantId,
        mealType,
        date: currentDate,
      });

      if (existingClaim) {
        return res.status(200).json({ claimed: true });
      } else {
        return res.status(200).json({ claimed: false });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
      console.error(error);
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

module.exports = {
  claimMeal,
  resetMealClaim,
  checkMealClaim,
};
