const mongoose = require("mongoose");

const PostModelSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    tattooStyle: {
      type: Array,
      required: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserCreatorModel",
    },

    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserCreatorModel",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("PostModel", PostModelSchema, "posts");
