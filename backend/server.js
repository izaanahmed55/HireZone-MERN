import express from "express";
import dbConnect from "./database/index.js";
import { PORT } from "./config/index.js";
import router from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const corsOptions = {
   credentials: true,
   origin: ["http://localhost:3000"],
};

const app = express();

app.use(cookieParser());

app.use(cors(corsOptions));

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       return callback(null, true);
//     },
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );

app.use(express.json({ limit: "50mb" }));

app.use(router);

dbConnect();

app.use(errorHandler);

app.listen(PORT, console.log(`Backend is running on port: ${PORT}`));
