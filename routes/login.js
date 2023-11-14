const express = require("express");
const login = express.Router();
const UserCreatorModel = require("../models/userCreatorModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

login.post("/login", async (req, res) => {
  //ora che facciamo il login dobbiamo recuperare l'utente che stiamo cercando, lo cerchiamo per email:
  const userCreator = await UserCreatorModel.findOne({ email: req.body.email });

  if (!userCreator) {
    return res.status(404).send({
      statusCode: 404,
      message: "user or creator not find",
    });
  }

  //compariamo la validità della password, accetta due parametri il primo è la password inviata tramite login
  //il secondo è la password che abbiamo trovato nel modello Author

  const validPassword = await bcrypt.compare(
    req.body.password,
    userCreator.password
  );
  if (!validPassword) {
    return res.status(400).send({
      statusCode: 400,
      message: "invalid email or password",
    });
  }

  //genero il token ed indico quali informazioni il token deve criptare
  const token = jwt.sign(
    {
      name: userCreator.name,
      lastName: userCreator.lastName,
      email: userCreator.email,
      role: userCreator.role,
      id: userCreator._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  ); //accetta tre parametri, il primo un oggetto che contiene ciò che voglio criptare nel token
  //il secondo è la stringa segreta nel file .env
  //il terzo gli diciamo quanto vogliamo che questo token duri, dopo 24h in questo caso il token sarà scaduto, dopodichè dovrrà rieffettuare il login per ottenere un nuovo token valido

  //infine restituiamo il token nell'header:

  res.header("Authorization", token).status(200).send({
    message: "you are logged in correctly",
    statusCode: 200,
    token,
  });
});

module.exports = login;
