const validator = require("validator");

const validatorUserCreator = (req, res, next) => {
  const errors = [];

  const {
    name,
    lastName,
    email,
    password,
    alias,
    avatar,
    tattooStyle,
    nation,
    region,
    city,
    address,
  } = req.body;

  /* #region  SEZIONE FUNZIONE DI VERIFICA ESTENSIONE */
  const isImageURL = (avatar) => {
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    if (!validator.isURL(avatar)) {
      return false;
    }
    const fileExtension = avatar.substring(avatar.lastIndexOf("."));
    return allowedExtensions.includes(fileExtension.toLowerCase());
  };

  /* #endregion */

  /* #region  SEZIONE DI VALIDAZIONE CONTENUTO */
  if (name && !validator.isString(name)) {
    errors.push("Name must be a non-empty string");
  }
  if (lastName && !validator.isString(lastName)) {
    errors.push("Last name must be a non-empty string");
  }
  if (password && !validator.isString(password)) {
    errors.push("Password must be a non-empty string");
  }
  if (email && (!validator.isString(email) || !validator.isEmail(email))) {
    errors.push("Email must be a valid email address");
  }

  if (alias && !validator.isString(alias)) {
    errors.push("alias must be a non-empty string");
  }

  if (avatar && !isImageURL(avatar)) {
    errors.push("Avatar must contain a correct image format");
  }

  if (tattooStyle.length > 0 && !Array.isArray(avatar)) {
    errors.push("tattooStyle must be an array with data");
  }

  if (nation && !validator.isString(nation)) {
    errors.push("nation must be a non-empty string");
  }
  if (region && !validator.isString(region)) {
    errors.push("region must be a non-empty string");
  }
  if (city && !validator.isString(city)) {
    errors.push("city must be a non-empty string");
  }
  if (address && !validator.isString(address)) {
    errors.push("address must be a non-empty string");
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  /* #endregion */

  next();
};

module.exports = validatorAuthor;
