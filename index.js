const express = require("express");
const Environment = require("./App/Configuration/Environment");
const bodyParser = require("body-parser");
const Routes = require("./App/Routes/index");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: Environment.ALLOWEDORIGINS || "*",
  })
);

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", Routes);

app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(500).send("Internal Server Error");
});

const port = Environment.SERVERPORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
