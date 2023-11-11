import express from "express";
import cors from "cors";
import config from "./config/index.js";
import router from "./api/v1/index.js";
import bodyParser from "body-parser";
import fs from "fs";

import celebrateErrorHandler from "./utils/celebrateError.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("uploads"));
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
app.use("/api/v1", router);
app.use(celebrateErrorHandler);
const { port } = config.app;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
