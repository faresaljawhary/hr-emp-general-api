import {
  writeFile,
  mkdir,
  readdir,
  readFile,
  rename,
  copyFile,
} from "fs/promises";
import { dirname, join, extname } from "path";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import config from "./../config/index.js";
const secretKey = config.encrypt.key;

if (!secretKey) {
  throw new Error("Secret key not found in the environment variables.");
}

// Encryption and decryption functions
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(config.encrypt.algorithm, secretKey, iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text) {
  const textParts = text.split(":");
  const iv = Buffer.from(textParts[0], "hex");
  const encryptedText = textParts[1];
  const decipher = crypto.createDecipheriv(
    config.encrypt.algorithm,
    secretKey,
    iv
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

async function createApplicationData(req) {
  const { labels, finalFormData } = req.body;
  const arrayOfObjects = Array.isArray(labels)
    ? labels.map(JSON.parse)
    : [JSON.parse(JSON.stringify(labels))];
  const formDataObj = JSON.parse(finalFormData);

  console.log("ddd", formDataObj);
  try {
    // Encrypt the JSON data
    const encryptedData = encrypt(JSON.stringify(formDataObj));
    console.log("UUID", formDataObj.UUID);
    // Define the directory where you want to save the JSON data
    const directory = "data";

    // Check if the "data" folder exists
    await mkdir(directory, { recursive: true });

    // Check for an existing JSON file in the "data" folder
    const files = await readdir(directory);
    const existingFile = files.find((file) => extname(file) === ".json");

    let filePath;

    if (existingFile) {
      // If an existing JSON file is found, use its name
      filePath = join(directory, existingFile);
    } else {
      throw new Error("No existing JSON file found to update.");
    }

    // Read existing data
    let existingData = {};
    try {
      const existingDataBuffer = await readFile(filePath, "utf-8");
      if (existingDataBuffer) {
        const decryptedData = decrypt(existingDataBuffer);
        existingData = JSON.parse(decryptedData);
      }
    } catch (err) {
      // File doesn't exist or is not valid JSON
    }

    // Merge existing data with new data (if any)
    const updatedData = Object.assign(existingData, formDataObj);

    // Encrypt the updated data as an object with an "encryptedString" property
    const updatedDataObject = {
      encryptedString: encrypt(JSON.stringify(updatedData)),
    };

    // Write the updated and encrypted data to the same file
    await writeFile(filePath, JSON.stringify(updatedDataObject), "utf-8");

    // Generate a new UUID-based name for the file
    const newFileName = `HREMP_${formDataObj.UUID}-01.json`;
    const newFilePath = join(directory, newFileName);

    // Rename the file to the new UUID-based name
    await rename(filePath, newFilePath);
    // Copy the file to the "upload" folder
    const uploadFolderPath = "uploads"; // Specify the path to your "upload" folder
    await mkdir(uploadFolderPath, { recursive: true });

    const uploadFilePath = join(uploadFolderPath, newFileName);
    await copyFile(newFilePath, uploadFilePath);
    await readAndUpdateUserDataFile(
      "usersData/user_data.json",
      formDataObj,
      arrayOfObjects,
      newFileName
    );
    console.log(
      `File has been copied to the 'upload' folder: ${uploadFilePath}`
    );

    console.log(
      `Data has been successfully updated and renamed to ${newFileName}`,
      arrayOfObjects
    );
    return {
      statusCode: 200,
      message: "Success",
    };
  } catch (err) {
    console.error("Error while updating data:", err);
    return {
      statusCode: 500,
      message: "Error during encrypt",
    };
  }
}
async function readAndUpdateUserDataFile(
  filePath,
  newData,
  attachments,
  jsonFileName
) {
  try {
    // Read the existing JSON file
    const existingDataBuffer = await readFile(filePath, "utf-8");
    if (!existingDataBuffer) {
      throw new Error("user data file is empty or does not exist.");
    }

    // Parse the existing JSON data
    const existingData = JSON.parse(existingDataBuffer);

    // Ensure that the "users" property is an array
    if (!existingData.users) {
      existingData.users = [];
    }

    // Push the new data into the "users" array
    existingData.users.push({
      ...newData,
      Attachments: [...JSON.parse(attachments)[0]?.images, jsonFileName],
      Download: false,
    });

    // Write the updated data back to the file
    await writeFile(filePath, JSON.stringify(existingData, null, 2), "utf-8");

    return {
      statusCode: 200,
      message: "Data has been successfully updated in user data file.",
    };
  } catch (err) {
    console.error("Error while updating data in user data file:", err);
    return {
      statusCode: 500,
      message: "Error during data update in user data file.",
    };
  }
}
const isMatch = (userValue, queryValue) => {
  if (!queryValue) {
    return true; // If queryValue is empty, it's a match
  }

  const parsedQuery = JSON.parse(queryValue);
  return userValue === parsedQuery.ar || userValue === parsedQuery.en;
};
async function getAllApplicationsData(req) {
  const { query } = req;
  const {
    Gender,
    Address_City,
    Work_Place,
    Nationality,
    Demand_Position,
    Marriage_Status,
    Search_Query,
  } = query;
  try {
    // Load your JSON data here (assuming you already have it loaded as an object)
    const rawData = await readFile(`usersData/user_data.json`, "utf8");
    const jsonData = JSON.parse(rawData);
    // Filter data based on query parameters
    const filteredData = jsonData.users.filter((user) => {
      return (
        (!Gender || user.Gender === Gender) &&
        isMatch(user.Address_City, Address_City) &&
        isMatch(user.Work_Place, Work_Place) &&
        isMatch(user.Nationality, Nationality) &&
        isMatch(user.Demand_Position, Demand_Position) &&
        isMatch(user.Marriage_Status, Marriage_Status) &&
        (!Search_Query ||
          user.Full_Name.includes(Search_Query) ||
          user.National_Num === Search_Query)
      );
    });

    return {
      statusCode: 200,
      message: "Success",
      records: filteredData,
      totalCount: filteredData.length, // If you need total count of filtered records
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      message: "Error during get data",
    };
  }
}
async function updateDownloadValueForUser(params, body) {
  const { usersIds } = body;

  try {
    const rawData = await readFile(`usersData/user_data.json`, "utf8");
    const usersArray = JSON.parse(rawData)?.users;
    for (const user of usersArray) {
      if (usersIds.includes(user.UUID)) {
        user.Download = true;
      }
    }
    const jsonData = {
      users: usersArray,
    };

    const result = await writeFile(
      "usersData/user_data.json",
      JSON.stringify(jsonData, null, 2),
      "utf-8"
    );
    return {
      statusCode: 200,
      message: "Success",
    };
  } catch (err) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
      error: err.message,
    };
  }
}
async function checkUserDuplication(params) {
  const { userId } = params;

  try {
    const rawData = await readFile(`usersData/user_data.json`, "utf8");
    const usersArray = JSON.parse(rawData)?.users;
    const checkIfExist = usersArray?.some(
      (user) => user?.National_Num === userId
    );
    return {
      statusCode: 200,
      message: "Success",
      isDuplicate: checkIfExist,
    };
  } catch (err) {
    return {
      statusCode: 500,
      message: "Internal Server Error",
      error: err.message,
    };
  }
}
export default {
  createApplicationData,
  getAllApplicationsData,
  updateDownloadValueForUser,
  checkUserDuplication,
};
