const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function validateRegisterImput(data) {
  let errors = {};
  console.log("register fired");
  console.log(data);

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "name must be between 2 and 30 characters";
  }

  if (!Validator.isLength(data.password, {min: 6, max: 30})) {
    errors.password = "Password Must be between 6 and 30 Characters";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter a valid email";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Confirm Password Must Equal Password";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name Feild Required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email Feild Required";
  }  

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password Feild Required";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password Feild Required";
  } 

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
