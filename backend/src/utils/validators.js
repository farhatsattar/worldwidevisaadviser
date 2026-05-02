const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email = "") => emailRegex.test(String(email).trim());

const isValidPassword = (password = "") => String(password).length >= 6;

module.exports = {
  isValidEmail,
  isValidPassword,
};
