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

import { TriviService } from "./Services/content/TriviaService";
import { ITriviaRepository } from "./Domain/repositories/content/ITriviaReporsitory";
import { ITriviaService } from "./Domain/services/content/ITriviaService";
import {TriviaController} from "./WebAPI/controllers/TriviaContoller";

import { ContentRepository } from "./Database/repositories/content/ContentReporsitory";
import { IContentRepository } from "./Domain/repositories/content/IContentReporsitory";
import { ContentService } from "./Services/content/ContentService";
import { IContentService } from "./Domain/services/content/IContentService";
import { ContentController } from "./WebAPI/controllers/ContentController";

import { TriviaRepository } from "./Database/repositories/content/TriviaReporsitory";
import { IEpisodeRepository } from "./Domain/repositories/content/IEpisodeReporsitory";
import { EpisodeRepository } from "./Database/repositories/content/EpisodeReporsitory";
import { IEpisodeService } from "./Domain/services/content/IEpisodeService";
import { EpisodeService } from "./Services/content/EpisodeService";
import { EpisodeController } from "./WebAPI/controllers/EpisodeContoller";

require("dotenv").config();

const app = express();

app.use((req, _res, next) => {
  console.log(new Date().toISOString(), req.method, req.url, "Origin:", req.headers.origin);
  next();
});

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); 

    const localhostRegex = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

    if (localhostRegex.test(origin)) {
      cb(null, true);
    } else {
      cb(new Error("Nedozvoljen origin: " + origin));
    }
  },
  credentials: true,
}));

app.use(express.json());

app.use((req, _res, next) => {
  if (req.url.includes("//")) req.url = req.url.replace(/\/{2,}/g, "/");
  next();
});

app.get("/api/v1/ping", (_req, res) => res.json({ ok: true, msg: "pong" }));


const userRepository: IUserRepository = new UserRepository();
const contentRepository: IContentRepository = new ContentRepository();
const triviaRepository:ITriviaRepository=new TriviaRepository();
const episodeRepisitory:IEpisodeRepository=new EpisodeRepository();

const authService: IAuthService = new AuthService(userRepository);
const userService: IUserService = new UserService(userRepository);
const contentService: IContentService = new ContentService(contentRepository);
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


app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("UNCAUGHT ERROR:", err);
  res.status(500).json({ message: "Internal error", detail: err?.message ?? String(err) });
});

export default app;
