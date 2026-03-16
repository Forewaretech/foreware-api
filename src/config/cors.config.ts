import cors from "cors";
import { AppError } from "../utils/AppError.js";

const allowedOrigins = [
  "https://foreware-admin.vercel.app",
  "https://foreware-mauve.vercel.app",
  "http://localhost:8080",
  "http://localhost:3000",
];

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
