const express = require("express");
const mongoose = require("mongoose");
const PORT = 5050;

const app = express();

//middleware
app.use(express.json());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

mongoose.connect("url del database", {
  useNewUrlParser: true,
  useUnifieldTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Errore during db connection"));
db.once("open", () => console.log("database successfully connected"));
app.listen(PORT, () => console.log(`server up and running on port ${PORT}`));
