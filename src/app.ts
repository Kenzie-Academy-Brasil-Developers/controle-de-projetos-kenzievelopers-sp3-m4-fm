import express, { Application } from "express";
import "dotenv/config";

const app: Application = express();
app.use(express.json());

app.post("/developers");
app.get("/developers/:id");
app.patch("/developers/:id");
app.delete("/developers/:id");
app.post("/developers/:id/infos");

app.post("/projects");
app.get("/projects/:id");
app.patch("/projects/:id");
app.delete("/projects/:id");
app.post("/projects/:id/technologies");
app.delete("/projects/:id/technologies/:name");

export default app;
