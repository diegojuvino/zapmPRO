import { Router } from "express";

import multer from "multer";
import isAuth from "../middleware/isAuth";
import uploadConfig from "../config/upload";
import * as UserController from "../controllers/UserController";

const userRoutes = Router();
const upload = multer(uploadConfig);

userRoutes.get("/users", isAuth, UserController.index);

userRoutes.get("/users/list", isAuth, UserController.list);

userRoutes.post("/users", upload.array("file"),isAuth, UserController.store);

userRoutes.put("/users/:userId", upload.array("file"),isAuth, UserController.update);

userRoutes.get("/users/:userId", isAuth, UserController.show);

userRoutes.delete("/users/:userId", isAuth, UserController.remove);

export default userRoutes;
