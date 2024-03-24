const TokenGenerator = require("uuid-token-generator");

const generateResetToken = () => {
  // Default is a 128-bit token encoded in base58
  const tokgen = new TokenGenerator();
  // Generate the token
  const token = tokgen.generate();
  return token;
};

module.exports = generateResetToken;
