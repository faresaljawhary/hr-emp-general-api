import express from "express";
import cors from "cors";
import config from "./config/index.js";
import router from "./api/v1/index.js";
import bodyParser from "body-parser";
import fs from "fs";

import celebrateErrorHandler from "./utils/celebrateError.js";

const app = express();
const { port } = config.app;

// Body parser middleware
app.use(bodyParser.json());

// Serve static files from the "uploads" directory
app.use(express.static("uploads"));
app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://npc-hr-general-employment.onrender.com"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
// Add a route for direct download
app.get("/download/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = `uploads/${filename}`;
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
