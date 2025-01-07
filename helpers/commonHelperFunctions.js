const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const privateKEY = fs.readFileSync(
  path.join(__dirname, "../certs/private.key")
);
const publicKEY = fs.readFileSync(
  path.join(__dirname, "../certs/public.key")
);
const {
  JWT: { JWT_ALGORITHM, JWT_ISSUER, JWT_AUDIENCE },
} = require("../configs/config");

const generateJwtToken = async (payload, expired_at) => {
  const signOptions = {
    issuer: JWT_ISSUER,
    subject: JWT_AUDIENCE,
    audience: JWT_AUDIENCE,
    algorithm: JWT_ALGORITHM,
    allowInsecureKeySizes: true,
  };
  expired_at && (signOptions.expiresIn = expired_at);
  return jwt.sign(payload, privateKEY, signOptions);
};

const verifyJwtToken = async (token) => {
  try {
    const verifyOptions = {
      issuer: JWT_ISSUER,
      subject: JWT_AUDIENCE,
      audience: JWT_AUDIENCE,
      algorithm: JWT_ALGORITHM,
    };
    const verifiedToken = jwt.verify(token, publicKEY, verifyOptions);
    return verifiedToken;
  } catch (e) {
    return null;
  }
};

module.exports = {
  generateJwtToken,
  verifyJwtToken,
};
