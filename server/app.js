import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// all public apis
import publicRouter from "./controllers/public/index.js";
import privateRouter from "./controllers/private/index.js";

// import middlwares
import authMiddelware from "./middlewares/verifyToken.js";

// security
import rateLimit from "express-rate-limit";

// dbConnection

import "./utils/dbConnect.js";

const buildPath = path.join(_dirname, "dist");

// checks if buildPath exits
if(fs.existsSync(buildPath)) {
    app.use(express.static(buildPath))
}



const PORT = process.env.PORT || 8012;

const app = express();
app.use(morgan("dev"));

const allowedDomains = ["https://todo.ishwari.online"];

const domainOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedDomains.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Not Allowed"));
    }
  },
  credentials: true,
};

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { msg: "Too many requests, please try again later." },
});

app.use(rateLimiter); // Apply globally

app.use(cors(domainOptions));

app.use(express.json()); // to accpt dat for post, put

// app.get("/", (req, res) => {
//   try {
//     res.status(200).json({ msg: "Hello server is On" });
//   } catch (error) {
//     console.log(error);
//   }
// });

// React SOA fallback : send index.html for any route not starting with /api
app.get(/^\/(?!api).*/,(req,res)=> {
    res.sendFile(path.join(buildPath, "index.html"));
});

app.use("/api/public", publicRouter);

app.use(authMiddelware);

app.use("/api/private", privateRouter);

// Not Found Route
app.use((req, res, next) => {
  res.status(404).json({ msg: "404- Not Found.", path: req.originalUrl });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ msg: "500- Internal Server Error" });
});

// Start the server Route
app.listen(PORT, () => {
  console.log(`Server is Up and Running at ${PORT}`);
});
