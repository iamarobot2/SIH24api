const { getDB } = require("../config/db");

const getDemographics = async (req, res) => {
  try {
    const { mealType, team, date, role } = req.query;
    const database = getDB();
    const participantsCollection = database.collection("participants");
    const claimsCollection = database.collection("mealClaims");

    const query = {};
    if (mealType && mealType !== "All") {
      query.mealType = mealType;
    }
    if (team && team !== "All") {
      query["participant.teamName"] = { $in: team.split(",") };
    }
    if (date) {
      query.date = date;
    }
    if (role && role !== "All") {
      query["participant.studentMentor"] = role;
    }

    const claimsData = await claimsCollection.find(query).toArray();
    const participantQuery = {};
    if (team && team !== "All") {
      participantQuery.teamName = { $in: team.split(",") };
    }
    if (role && role !== "All") {
      participantQuery.studentMentor = role;
    }

    const participantsData = await participantsCollection
      .find(participantQuery)
      .toArray();
    const claimedParticipantIds = claimsData.map(
      (claim) => claim.participant.participantId
    );
    const unclaimedParticipants = participantsData.filter(
      (participant) =>
        !claimedParticipantIds.includes(participant.participantId)
    );
    const unclaimedStudents = unclaimedParticipants.filter(
      (participant) => participant.studentMentor === "Student"
    ).length;
    const unclaimedMentors = unclaimedParticipants.filter(
      (participant) => participant.studentMentor === "Mentor"
    ).length;

    res.status(200).json({
      claimsData,
      totalParticipants: participantsData.length,
      unclaimedParticipants: unclaimedParticipants.length,
      unclaimedStudents,
      unclaimedMentors,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error(error);
  }
};

module.exports = {
  getDemographics,
};
