require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const { connectDB, closeDB } = require("./config/db");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      "mongoErrLog.log"
    );
    process.exit(1);
  });
app.use(logger);
app.use(cors({ origin: "*" }));
app.use(express.json());

const demographics = require("./routes/demographics");
const meals = require("./routes/mealClaims");
const participants = require("./routes/participants");
const search = require("./routes/search");

app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

app.use("/api/demographics", demographics);
app.use("/api/meals", meals);
app.use("/api/participants", participants);
app.use("/api/search", search);
app.use(errorHandler);

process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});
