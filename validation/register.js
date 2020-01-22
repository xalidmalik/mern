const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.passwordCheck = !isEmpty(data.passwordCheck) ? data.passwordCheck : "";

  if (!validator.isLength(data.name, { min: 3, max: 30 })) {
    errors.name = "İsim 3 ile 30 karakter arasında olmalı";
  }
  if (!validator.isLength(data.password, { min: 6, max: 16 })) {
    errors.password = "İsim 6 ile 16 karakter arasında olmalı";
  }

  if (validator.isEmpty(data.name)) {
    errors.name = "Isim zorunludur";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "Email zorunludur";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "Şifre zorunludur";
  }
  if (validator.isEmpty(data.passwordCheck)) {
    errors.passwordCheck = "Şifre onayi zorunludur";
  }

  if (validator.isEmail(data.email)) {
    errors.email = "Email Hatalidir";
  }

  if (validator.equals(data.password, data.passwordCheck)) {
    errors.passwordCheck = "Şifre uyşmuyor";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
