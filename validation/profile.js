const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle);

  if (!validator.isLength(data.name, { min: 3, max: 30 })) {
    errors.name = "İsim 3 ile 30 karakter arasında olmalı";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
