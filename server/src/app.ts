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

import { TriviService } from "./Services/trivia/TriviaService";
import { ITriviaRepository } from "./Domain/repositories/trivia/ITriviaReporsitory";
import { ITriviaService } from "./Domain/services/trivia/ITriviaService";
import {TriviaController} from "./WebAPI/controllers/TriviaContoller";

import { ContentRepository } from "./Database/repositories/content/ContentReporsitory";
import { IContentRepository } from "./Domain/repositories/content/IContentReporsitory";
import { ContentService } from "./Services/content/ContentService";
import { IContentService } from "./Domain/services/content/IContentService";
import { ContentController } from "./WebAPI/controllers/ContentController";

import { TriviaRepository } from "./Database/repositories/trivia/TriviaReporsitory";
import { IEpisodeRepository } from "./Domain/repositories/episode/IEpisodeReporsitory";
import { EpisodeRepository } from "./Database/repositories/episode/EpisodeReporsitory";
import { IEpisodeService } from "./Domain/services/episode/IEpisodeService";
import { EpisodeService } from "./Services/episode/EpisodeService";
import { EpisodeController } from "./WebAPI/controllers/EpisodeContoller";

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

const userRepository: IUserRepository = new UserRepository();
const contentRepository: IContentRepository = new ContentRepository();
const triviaRepository:ITriviaRepository=new TriviaRepository();
const episodeRepisitory:IEpisodeRepository=new EpisodeRepository();

const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const contentService: IContentService = new ContentService(contentRepository,triviaRepository,episodeRepisitory);
const triviaService:ITriviaService=new TriviService(triviaRepository);
const episodeService:IEpisodeService=new EpisodeService(episodeRepisitory);

const authController = new AuthController(authService);
const userController = new UserController(userService);
const contentController = new ContentController(contentService);
const triviaController= new TriviaController(triviaService);
const episodeContoller=new EpisodeController(episodeService);

app.use("/api/v1", contentController.getRouter());
app.use("/api/v1", authController.getRouter());
app.use("/api/v1", userController.getRouter());
app.use("/api/v1",triviaController.getRouter());
app.use("/api/v1",episodeContoller.getRouter());




export default app;
