const TokenGenerator = require("uuid-token-generator");

const generateResetToken = () => {
  const tokgen = new TokenGenerator(); // Default is a 128-bit token encoded in base58
  const token = tokgen.generate(); // Generate the token
  return token;
};

module.exports = generateResetToken;
