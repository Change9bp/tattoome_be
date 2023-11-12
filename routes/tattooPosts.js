const express = require("express");
const tattooPost = express.Router();
const PostModel = require("../models/postModel");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const crypto = require("crypto");
require("dotenv").config();

/* #region  SEZIONE CLOUDINARY */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tattoome/post_img",
    format: async (req, file) => "png",
    public_id: (req, file) => file.name,
  },
});

const cloudUpload = multer({ storage: cloudStorage });

tattooPost.post(
  "/tattooPost/cloudUpload",
  cloudUpload.single("cover"),
  async (req, res) => {
    //non mi interessa gestire altro se ne occupa cloudinary
    try {
      res.status(200).json({ cover: req.file.path });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "internal server error",
      });
    }
  }
);
/* #endregion */
