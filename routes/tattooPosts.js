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

//GET con pagination
tattooPost.get(
  "/tattooPost",
  /*verifyToken,*/ async (req, res) => {
    const { page, pageSize } = req.query;
    console.log("page", page, "pagesize", pageSize);
    const posts = await PostModel.find()
      .populate({
        path: "author",
        select: "_id name lastName email avatar",
      })
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const totalPosts = await PostModel.count();

    try {
      res.status(200).send({
        statusCode: 200,
        currentPage: Number(page),
        totalPages: Math.ceil(totalPosts / pageSize),
        posts,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "internal server error",
      });
    }
  }
);

//GET BY ID

tattooPost.get("/tattooPost/:_id", async (req, res) => {
  const { _id } = req.params;

  const post = await PostModel.findById(_id);
  if (!post) {
    return res.status(404).send({
      statusCode: 404,
      message: "ID post dosent exists",
    });
  }

  try {
    res.status(200).send({
      statusCode: 200,
      message: "post finded",
      post,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Server internal error",
    });
  }
});

//GET CON ID DEL CREATOR

tattooPost.get(
  "/tattooPost/:idCreator/creator",
  /*verifyToken,*/ async (req, res) => {
    const { idCreator } = req.params;
    const findPost = await PostModel.find({ author: idCreator }).populate({
      path: "author",
      select: "_id name lastName email avatar",
    });
    if (!findPost) {
      return res.status(404).send({
        statusCode: 404,
        message: "No Post whit this creator",
      });
    }
    try {
      res.status(200).send({
        statusCode: 200,
        message: "Post finded",
        findPost,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Server internal error",
      });
    }
  }
);

//POST
tattooPost.post(
  "/tattooPost",
  /*verifyToken, validatorPost,*/ async (req, res) => {
    const addPost = new PostModel({
      tattooStyle: req.body.tattooStyle,
      title: req.body.title,
      cover: req.body.cover,
      author: req.body.author,
      content: req.body.content,
    });

    try {
      const post = await addPost.save();

      res.status(200).send({
        statusCode: 200,
        message: "post saved successfully",
        payload: post,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Server internal error",
        error,
      });
    }
  }
);

//PATCH

tattooPost.patch(
  "/tattooPost/:_id",
  /*verifyToken, validatorPost,*/ async (req, res) => {
    const { _id } = req.params;
    const postExists = await PostModel.findById(_id);
    if (!postExists) {
      return res.status(404).send({
        statusCode: 404,
        message: "Post dosent exsists or already deleted",
      });
    }

    try {
      const dataToUpdate = req.body;
      const options = { new: true };
      const result = await PostModel.findByIdAndUpdate(
        _id,
        dataToUpdate,
        options
      );

      res.status(200).send({
        statusCode: 200,
        message: "Post edited correctly",
        result,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Server internal error",
        error,
      });
    }
  }
);

//DELETE

tattooPost.delete(
  "/tattooPost/:_id",
  /*verifyToken, validatorPost,*/ async (req, res) => {
    const { _id } = req.params;

    const delPost = await PostModel.findById(_id);
    if (!delPost) {
      return res.status(404).send({
        statusCode: 404,
        message: "Post dosent exsists or already deleted",
      });
    }
    try {
      const postToDelete = await PostModel.findByIdAndDelete(_id);

      res.status(200).send({
        statusCode: 200,
        message: "post correctly deleted",
        postToDelete,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Server internal error",
        error,
      });
    }
  }
);

module.exports = tattooPost;
