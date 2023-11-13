import express from "express";
import cors from "cors";
import config from "./config/index.js";
import router from "./api/v1/index.js";
import bodyParser from "body-parser";
import fs from "fs";
import cron from "node-cron";
import axios from "axios";

import celebrateErrorHandler from "./utils/celebrateError.js";

const app = express();
const { port } = config.app;

// Applying CORS middleware at the beginning
app.use(cors());

// Body parser middleware
app.use(bodyParser.json());

// Serve static files from the "uploads" directory
app.use(express.static("uploads"));

// Add a route for direct download
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = `./uploads/${filename}`;
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send("File not found");
    } else {
      res.download(filePath, filename);
    }
  });
});

// API routes
app.use("/api/v1", router);

// Error handler for celebrate validation errors
app.use(celebrateErrorHandler);

// Define a cron job to call the /api/v1 endpoint every 10 minutes
cron.schedule("*/10 * * * *", async () => {
  try {
    // Make a GET request to your API endpoint
    const response = await axios.get(
      "https://api-general-form.onrender.com/api/v1/refresh-api"
    );
    console.log("API called:", response.data); // Log the response data
  } catch (error) {
    console.error("Error calling API:", error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
