const validator = require("validator");
const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!email || !validator.isEmail(email)) {
    throw new Error("Email id is not valid");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

const validateEditProfileData = (req) => {
  const allowEditFields = [
    "firstName",
    "lastName",
    "email",
    "photoUrl",
    "age",
    "gender",
    "skills",
    "About",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowEditFields.includes(field),
  );
  return isEditAllowed;
};
module.exports = {
  validateSignUpData,
  validateEditProfileData,
};
