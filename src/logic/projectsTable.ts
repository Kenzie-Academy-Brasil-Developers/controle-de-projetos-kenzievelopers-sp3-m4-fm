import { Request, Response } from "express";
import {
  IProjectUpatedRequestBody,
  TProjectRequestBodyWithEndDate,
  TProjectRequestBodyWithoutEndDate,
  TProjectResponseBodyWithEndDate,
  TProjectResponseBodyWithoutEndDate,
} from "../interface/iProjects";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { IProjectTecResponseBody } from "../interface/iProjects";
import { IAddtechBodyRequest } from "../interface/iProjectTech";

export const createProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectsData:
    | TProjectRequestBodyWithEndDate
    | TProjectRequestBodyWithoutEndDate = req.body;

  const queryString: string = format(
    `
  INSERT INTO 
    projects
  (%I)
      VALUES
  (%L)
      RETURNING *;
  `,
    Object.keys(projectsData),
    Object.values(projectsData)
  );

  const queryResult: QueryResult<
    TProjectResponseBodyWithEndDate | TProjectResponseBodyWithoutEndDate
  > = await client.query(queryString);

  return res.status(201).json(queryResult.rows[0]);
};

export const listProjectTechnology = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  const queryString: string = `
    SELECT
      proj."id" AS "projectId",
      proj."name" AS "projectName",
      proj."description" AS "projectDescription",
      proj."estimatedTime" AS "projectEstimatedTime",
      proj."repository" AS "projectRepository",
      proj."startDate" AS "projectStartDate",
      proj."endDate" AS "projectEndDate",
      proj."developerId" AS "projectDeveloperId",
      tec.id AS "technologyId",
      tec.name AS "technologyName"
    FROM
      projects_technologies projtec
      RIGHT JOIN technologies tec ON tec.id = projtec."technologyId"
      RIGHT JOIN projects proj ON projtec."projectId" = proj."id"
    WHERE proj."id" = $1;
  `;

  const queryResult: QueryResult<IProjectTecResponseBody> =
    await client.query<IProjectTecResponseBody>(queryString, [id]);

  return res.status(200).json(queryResult.rows);
};

export const updateProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const projectData: IProjectUpatedRequestBody = req.body;
  const id: number = parseInt(req.params.id);

  const queryString: string = format(
    `
  UPDATE
    projects
    SET(%I)=ROW(%L)
  WHERE
      id = $1
  RETURNING *;
  `,
    Object.keys(projectData),
    Object.values(projectData)
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<
    TProjectResponseBodyWithoutEndDate | TProjectResponseBodyWithEndDate
  > = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const querryString: string = `
    DELETE FROM
        projects
    WHERE
      id = $1;
    `;

  const queryConfig: QueryConfig = {
    text: querryString,
    values: [id],
  };
  await client.query(queryConfig);
  return res.status(204).send();
};

export const addProjectTech = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id = parseInt(req.params.id);
  const techDate = new Date();

  const techData: IAddtechBodyRequest = {
    projectId: id,
    technologyId: res.locals.tech.techId,
    addedIn: techDate,
  };

  const queryString: string = format(
    `
        INSERT INTO 
            projects_technologies 
            (%I)
        VALUES 
            (%L)
        RETURNING *;
    `,
    Object.keys(techData),
    Object.values(techData)
  );

  await client.query(queryString);

  const queryTemplate: string = `
        SELECT
            t.id as "technologyId",
            t."name" as "technologyName",
            p.id as "projectId",
            p."name" as "projectName",
            p."description" as "projectDescription",
            p."estimatedTime" as "projectEstimatedTime",
            p."repository" as "projectRepository",
            p."startDate" as "projectStartDate",
            p."endDate" as "projectEndDate"
        FROM
            technologies t 
        LEFT JOIN 
            projects_technologies pt ON pt."technologyId" = t.id
        LEFT JOIN 
            projects p  ON pt."projectId" = p.id
        WHERE p.id = $1;
    `;
  const newQueryConfig: QueryConfig = {
    text: queryTemplate,
    values: [techData.projectId],
  };

  const queryResult: QueryResult<IProjectTecResponseBody> = await client.query(
    newQueryConfig
  );
  return res.status(201).json(queryResult.rows[0]);
};

export const deleteTechInProject = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const idProj: number = parseInt(req.params.id);
  const idTechs: number = Number(res.locals.queryResult);

  const queryString: string = `
        DELETE FROM
            projects_technologies pt 
        WHERE
            pt."technologyId" = $1 AND pt."projectId" = $2
        RETURNING *;   
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [idTechs, idProj],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(400).json({
      message: "Project not found.",
    });
  }

  return res.status(204).json();
};
