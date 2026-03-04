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

const app = express();

app.use(corsMiddleware);
app.use(express.json());

// Feature Routes
app.use("/api/users", userRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/forms", formsRoutes);
app.use("/api/tracking-codes", trackingRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/submissions", submissionRoutes);

app.use(errorHandler);

export default app;
