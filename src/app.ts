import express, { Application } from "express";
import "dotenv/config";
import {
  createDeveloper,
  createDeveloperInfo,
  deleteDeveloper,
  listDeveloper,
  updateDeveloper,
} from "./logic/developersTable";
import { ensureDeveloperEmailExistsMiddleware } from "./middlewares/developersTable/ensureDeveloperEmailExists.middlewares";
import { ensureDeveloperExistsMiddleware } from "./middlewares/developersTable/ensureDeveloperExists.middleware";
import { ensureDeveloperInfoExistsMiddleware } from "./middlewares/developersTable/ensureDeveloperInfoExists.middleware";

import {
  addProjectTech,
  createProject,
  deleteProject,
  listProjectTechnology,
  updateProject,
} from "./logic/projectsTable";
import { ensureDeveloperIdExistsMiddleware } from "./middlewares/projectsTable/ensureDeveloperIdExists.middleware";
import { ensureProjectIdExistsMiddleware } from "./middlewares/projectsTable/ensureProjectExists.middleware";
import { ensureTechNameExists } from "./middlewares/projectsTable/ensureTechNameExists.middleware";
import { ensureTechNameIsAlreadyInUseMiddleware } from "./middlewares/projectsTable/ensureTechNameIsAlreadyInUse.middleware";
// import { ensureTechNameIsAlreadyInUseMiddleware } from "./middlewares/projectsTable/ensureTechNameIsAlreadyInUse.middleware";

const app: Application = express();
app.use(express.json());

app.post("/developers", ensureDeveloperEmailExistsMiddleware, createDeveloper);
app.get("/developers/:id", ensureDeveloperExistsMiddleware, listDeveloper);
app.patch(
  "/developers/:id",
  ensureDeveloperExistsMiddleware,
  ensureDeveloperEmailExistsMiddleware,
  updateDeveloper
);
app.delete("/developers/:id", ensureDeveloperExistsMiddleware, deleteDeveloper);
app.post(
  "/developers/:id/infos",
  ensureDeveloperExistsMiddleware,
  ensureDeveloperInfoExistsMiddleware,
  createDeveloperInfo
);

app.post("/projects", ensureDeveloperIdExistsMiddleware, createProject);
app.get(
  "/projects/:id",
  ensureProjectIdExistsMiddleware,
  listProjectTechnology
);
app.patch(
  "/projects/:id",
  ensureProjectIdExistsMiddleware,
  ensureDeveloperIdExistsMiddleware,
  updateProject
);
app.delete("/projects/:id", ensureProjectIdExistsMiddleware, deleteProject);
app.post(
  "/projects/:id/technologies",
  ensureProjectIdExistsMiddleware,
  ensureTechNameExists,
  ensureTechNameIsAlreadyInUseMiddleware,
  addProjectTech
);
app.delete("/projects/:id/technologies/:name");

export default app;
