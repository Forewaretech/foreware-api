import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  idValidationSchema,
  postValidationSchema,
  updatePostValidationSchema,
} from "./post.validation.js";
import {
  createPostController,
  getPostsController,
  deletePostsController,
  getPostController,
  updatePostController,
} from "./post.controller.js";

const router = Router();

router.get("/", getPostsController);
router.delete("/:id", validate(idValidationSchema), deletePostsController);
router.get("/:id", validate(idValidationSchema), getPostController);
router.patch(
  "/:id",
  validate(idValidationSchema),
  validate(updatePostValidationSchema),
  updatePostController,
);
router.post("/", validate(postValidationSchema), createPostController);

export default router;
