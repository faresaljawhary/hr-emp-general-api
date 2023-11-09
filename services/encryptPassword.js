import config from "./../config/index.js";
import crypto from "crypto";

function EncryptPassword(text) {
  const algorithm = config.encrypt.algorithm;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(config.encrypt.key),
    iv
  );
  let encryptedText = cipher.update(text, "utf8", "base64");
  encryptedText += cipher.final("base64");
  return iv.toString("hex") + encryptedText;
}

export default {
  EncryptPassword,
};
