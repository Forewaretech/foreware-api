import express from "express";
import userRoutes from "./features/users/user.routes.js";
import storageRoutes from "./features/storage/storage.routes.js";
import postsRoutes from "./features/blog/post.routes.js";
import corsMiddleware from "./config/cors.config.js";

const app = express();

app.use(corsMiddleware);
app.use(express.json());

// Feature Routes
app.use("/api/users", userRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/posts", postsRoutes);

export default app;
