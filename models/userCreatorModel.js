const mongoose = require("mongoose");
const Email = require("mongoose-type-email");

const UserCreatorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    lastName: {
      type: String,
      required: true,
    },

    alias: {
      type: String,
      required: false,
    },

    email: {
      type: Email,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      required: false,
      default: "/public/usrImgDefault.jpg",
    },

    tattooStyle: {
      type: Array,
      required: false,
    },

    role: {
      type: String,
      required: false,
      default: "user",
    },

    nation: {
      type: String,
      required: false,
    },

    region: {
      type: String,
      required: false,
    },

    city: {
      type: String,
      required: false,
    },

    address: {
      type: String,
      required: false,
    },

    registerDate: {
      type: Date,
      required: false,
      default: Date.now,
    },

    /* likes: {
      type: Array,
      required: false,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserCreatorModel",
      },
    },*/
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

module.exports = mongoose.model(
  "UserCreatorModel",
  UserCreatorSchema,
  "userCreator"
);
