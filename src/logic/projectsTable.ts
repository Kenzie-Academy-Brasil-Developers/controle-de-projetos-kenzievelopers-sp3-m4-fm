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
import { IProjectTecResponseBody } from "../interface/iProjectsTechnologies";
import {
  ITechnology,
  TTechnologyRequestBody,
} from "../interface/iTechnologies";

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
      "projects_technologies" "projInf"
  RIGHT JOIN
      technologies tec ON tec.id = "projInf"."technologyId"
  RIGHT JOIN
      projects proj ON "projInf"."projectId" = proj."id"
  WHERE proj."id"=$1;
  `;

  const queryResult: QueryResult<IProjectTecResponseBody> = await client.query(
    queryString,
    [id]
  );

  return res.json(queryResult.rows[0]);
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

// export const addTechnologyToProject = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const technologyData:TTechnologyRequestBody=req.body;
//   const projectsId:number=parseInt(req.params.id)

//   const data: = {
//     ...technologyData,
//     projectsId,
// }

//   const { name } = req.body;

//   const queryPart: string = `
//   SELECT
//   *
// FROM
//   technologies t
// WHERE
//   t.name = $1
// `;
// const partQueryFormat: string = format(queryPart, partName);
//   const partQueryResult: QueryResult<IProjectTecResponseBody> = await client.query(
//     partQueryFormat,
//     [name]
//   );

//   return res.json(queryResult.rows[0]);
// };
