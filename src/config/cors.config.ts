import cors from "cors";
import { AppError } from "../utils/AppError.js";

const allowedOrigins = ["http://localhost:8080"];

export const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError("Not allowed by CORS", 403));
    }
  },
  credentials: true,
};

export default cors(corsOptions);
