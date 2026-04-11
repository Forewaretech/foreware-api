import cors from "cors";
import { AppError } from "../utils/AppError.js";

const allowedOrigins = [process.env.ADMIN_URL, process.env.CLIENT_URL];

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
