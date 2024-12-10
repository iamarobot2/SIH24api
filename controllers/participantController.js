const { getDB } = require("../config/db");

const getParticipant = async (req, res) => {
  if (req.method === "GET") {
    try {
      const participantId = req.query.id;
      if (!participantId) {
        return res.status(400).json({ message: "Participant ID is required" });
      }
      const database = getDB();
      const participants = database.collection("participants");

      const participant = await participants.findOne({
        participantId: participantId,
      });

      if (participant) {
        res.status(200).json(participant);
      } else {
        res.status(404).json({ message: "Participant not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
      console.log(error);
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

module.exports = {
  getParticipant,
};