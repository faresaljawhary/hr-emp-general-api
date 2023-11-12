import jwt from "jsonwebtoken";

import config from "./../config/index.js";
import crypto from "crypto";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';


function decrypt(encryptedText) {
  const algorithm = config.encrypt.algorithm;
  const ivHex = encryptedText.slice(0, 32); // IV is the first 32 characters
  const iv = Buffer.from(ivHex, "hex");
  const textToDecrypt = encryptedText.slice(32); // The rest is the encrypted text
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(config.encrypt.key),
    iv
  );
  let decryptedText = decipher.update(textToDecrypt, "base64", "utf8");
  decryptedText += decipher.final("utf8");
  return decryptedText;
}


const signInAndCheckHrGroup = async (username, password) => {

  try {
    const rawData = await readFile('./hr-users.json', 'utf8');
    const jsonData = JSON.parse(rawData)?.users?.find(
      (user) => user.username === username
    );

    const decryptedPassword = decrypt(jsonData.password);
    
    let isMemberOfHrGroup;
    if (Object.keys(jsonData)?.length >= 0 && password === decryptedPassword) {
      isMemberOfHrGroup = true;
    } else {
      throw new Error('Invalid username or password');
    }

    if (isMemberOfHrGroup) {
      const payload = {
        username,
      };

      const token = jwt.sign(payload, config.auth.securityCode, {
        expiresIn: '1h',
      });

      return {
        statusCode: 200,
        message: 'User is a member of the "HR" group.',
        token,
      };
    } else {
      return {
        statusCode: 403,
        message: 'User is not a member of the "HR" group.',
      };
    }
  } catch (error) {
    console.error('Error during authentication and group check:', error);
    return {
      statusCode: 401,
      message: 'Invalid username or password',
    };
  }
};

export default {
  signInAndCheckHrGroup,
};
