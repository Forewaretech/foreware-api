import express from "express";
import userRoutes from "./features/users/user.routes.js";
import storageRoutes from "./features/storage/storage.routes.js";
import postsRoutes from "./features/blog/post.routes.js";
import formsRoutes from "./features/form/form.routes.js";
import corsMiddleware from "./config/cors.config.js";
import trackingRoutes from "./features/tracking/tracking.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import leadRoutes from "./features/lead/lead.routes.js";
import submissionRoutes from "./features/submission/submission.route.js";
import authRoutes from "./features/auth/auth.routes.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import activityRoutes from "./features/activity/activitty.routes.js";
import emailToRoutes from "./features/emailto/emailto.routes.js";

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(corsMiddleware);
app.use(cookieParser());
// app.use(helmet());
app.use(morgan("dev"));
// app.use(express.static("public"));

// Feature Routes
app.use("/api/users", userRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/forms", formsRoutes);
app.use("/api/tracking-codes", trackingRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/activity-logs", activityRoutes);
app.use("/api/emailto", emailToRoutes);

app.use(errorHandler);

export default app;
