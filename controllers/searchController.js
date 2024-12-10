const { getDB } = require("../config/db");

const searchParticipants = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "search parameter is required" });
  }

  try {
    const database = getDB();
    const participants = database.collection("participants");

    const results = await participants
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { teamName: { $regex: query, $options: "i" } },
          { mailId: { $regex: query, $options: "i" } },
        ],
      })
      .limit(10)
      .toArray();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error(error);
  }
};

const searchTeams = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "search parameter is required" });
  }

  try {
    const database = getDB();
    const participants = database.collection("participants");

    const teams = await participants.distinct("teamName", {
      teamName: { $regex: query, $options: "i" },
    });

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error(error);
  }
};

module.exports = {
  searchParticipants,
  searchTeams,
};