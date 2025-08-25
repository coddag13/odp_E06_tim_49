import express from "express";
import cors from "cors";

import { IAuthService } from "./Domain/services/auth/IAuthService";
import { AuthService } from "./Services/auth/AuthService";
import { IUserRepository } from "./Domain/repositories/users/IUserRepository";
import { UserRepository } from "./Database/repositories/users/UserRepository";
import { AuthController } from "./WebAPI/controllers/AuthController";
import { IUserService } from "./Domain/services/users/IUserService";
import { UserService } from "./Services/users/UserService";
import { UserController } from "./WebAPI/controllers/UserController";

import { ContentRepository } from "./Database/repositories/content/ContentReporsitory";
import { IContentRepository } from "./Domain/repositories/content/IContentReporsitory";
import { ContentService } from "./Services/content/ContentServise";
import { IContentService } from "./Domain/services/content/IContentServise";
import { ContentController } from "./WebAPI/controllers/ContentController";

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

const userRepository: IUserRepository = new UserRepository();
const contentRepository: IContentRepository = new ContentRepository();

const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const contentService: IContentService = new ContentService(contentRepository);

const authController = new AuthController(authService);
const userController = new UserController(userService);
const contentController = new ContentController(contentService);

app.use("/api/v1", contentController.getRouter());
app.use("/api/v1", authController.getRouter());
app.use("/api/v1", userController.getRouter());



export default app;
