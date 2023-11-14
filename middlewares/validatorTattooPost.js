const validator = require("validator");

const validatorTattooPost = (req, req, next) => {
  const errors = [];

  const { title, content, cover, tattooStyle } = req.body;

  /* #region  SEZIONE FUNZIONE DI VERIFICA ESTENSIONE */
  const isImageURL = (cover) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    if (!validator.isURL(cover)) {
      return false;
    }
    const fileExtension = cover.substring(cover.lastIndexOf("."));
    return allowedExtensions.includes(fileExtension.toLowerCase());
  };
  /* #endregion */

  if (title && !validator.isString(title)) {
    errors.push("Title must be a non-empty string");
  }

  if (content && !validator.isString(content)) {
    errors.push("Content must be a non-empty string");
  }

  if (cover && !isImageURL(cover)) {
    errors.push("Cover must contain a correct image format");
  }

  if (tattooStyle.length > 0 && !Array.isArray(avatar)) {
    errors.push("tattooStyle must be an array with data");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

module.exports = validatorTattooPost;
