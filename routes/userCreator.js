const express = require("express");
const userCreator = express.Router();
const UserCreatorModel = require("../models/userCreatorModel");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
require("dotenv").config();

//MANCANO I VALIDATOR, VALIDATOR USER VALIDATOR VERIFYTOKEN

/* #region  SEZIONE CLOUDINARY */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tattoome/avatar",
    format: async (req, file) => "png",
    public_id: (req, file) => file.name,
  },
});

const cloudUpload = multer({ storage: cloudStorage });

userCreator.post(
  "/userCreator/cloudUpload",
  cloudUpload.single("avatar"),
  async (req, res) => {
    try {
      res.status(200).json({ avatar: req.file.path });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "internal server error",
      });
    }
  }
);

/* #endregion */

/* #region  SEZIONE ROTTE */

//GET

userCreator.get("/userCreator", async (req, res) => {
  const userCreators = await UserCreatorModel.find();
  try {
    res.status(200).send({
      statusCode: 200,
      userCreators,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Server internal error",
    });
  }
});

//GET SOLO CREATOR

userCreator.get("/userCreator/onlyCreator", async (req, res) => {
  const userCreators = await UserCreatorModel.find({ role: "creator" });
  try {
    res.status(200).send({
      statusCode: 200,
      userCreators,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Server internal error",
    });
  }
});

//GET BY ID

userCreator.get("/userCreator/:_id", async (req, res) => {
  const { _id } = req.params;

  const userCreator = await UserCreatorModel.findById(_id);

  if (!userCreator) {
    return res.status(404).send({
      statusCode: 404,
      message: "this user or creator does not exist",
    });
  }

  try {
    res.status(200).send({
      statusCode: 200,
      userCreator,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Server internal error",
    });
  }
});

// POST
userCreator.post(
  "/userCreator",
  /*validatorUserCreator,*/ async (req, res) => {
    //imposto un lvl di criptazione 10
    const salt = await bcrypt.genSalt(10);
    //costante che cripta la password accetta due parametri, il primo cosa deve criptare ed il secondo con che metodo deve criptare
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new UserCreatorModel({
      name: req.body.name,
      lastName: req.body.lastName,
      alias: req.body.alias,
      email: req.body.email,
      password: hashedPassword, //passiamo la password criptata
    });
    try {
      const user = await newUser.save();

      res.status(200).send({
        statusCode: 200,
        message: "User saved successfully",
        payload: user,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Server internal error",
      });
    }
  }
);

//PATCH

userCreator.patch(
  "/userCreator/:_id",
  /*validatorUserCreator,
    verifyToken,*/
  async (req, res) => {
    const { _id } = req.params;

    const userExists = await UserCreatorModel.findById(_id);

    console.log("esiste l'autore??", userExists);

    if (!userExists) {
      return res.status(404).send({
        statusCode: 404,
        message: "user does not exists",
      });
    }

    try {
      const dataToUpdate = req.body;

      if (dataToUpdate.password) {
        const salt = await bcrypt.genSalt(10);
        //costante che cripta la password accetta due parametri, il primo cosa deve criptare ed il secondo con che metodo deve criptare
        dataToUpdate.password = await bcrypt.hash(req.body.password, salt);
      }

      const options = { new: true };

      const result = await UserCreatorModel.findByIdAndUpdate(
        _id,
        dataToUpdate,
        options
      );
      res.status(200).send({
        statusCode: 200,
        message: "User correctly updated to CREATOR!",
        result,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Server internal error",
        error: error,
      });
    }
  }
);

//DELETE

userCreator.delete(
  "/userCreator/:_id",
  /*verifyToken,*/ (req, res) => {
    const { _id } = req.params;
    console.log(_id);
    try {
      const userCreatorToDelete = UserCreatorModel.findByIdAndDelete(_id);
      if (!userCreatorToDelete) {
        return res.status(404).send({
          statusCode: 404,
          message: "user or creator dosent exists or already deleted",
        });
      }
      res.status(200).send({
        statusCode: 200,
        message: "author correctly deleted",
        userCreatorToDelete,
      });
    } catch (error) {}
    res.status(500).send({
      statusCode: 500,
      message: "Server internal error",
    });
  }
);

/* #endregion */
module.exports = userCreator;
