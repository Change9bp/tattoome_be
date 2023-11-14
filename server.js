const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const userCreatorRoute = require("./routes/userCreator");
const tattooPostRoute = require("./routes/tattooPosts");
const loginRoute = require("./routes/login");

require("dotenv").config();

const app = express();

app.use("/public", express.static(path.join(__dirname, "./public")));

//middleware
app.use(express.json());
app.use(cors());
app.use("/", userCreatorRoute);
app.use("/", tattooPostRoute);
app.use("/", loginRoute);

mongoose.connect(process.env.URL_SERVER_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Errore during db connection"));
db.once("open", () => console.log("database successfully connected"));
app.listen(process.env.PORT_DB, () =>
  console.log(`server up and running on port ${process.env.PORT_DB}`)
);
