const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  if (!validator.isLength(data.name, { min: 3, max: 30 })) {
    errors.name = "İsim 3 ile 30 karakter arasında olmalı";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
