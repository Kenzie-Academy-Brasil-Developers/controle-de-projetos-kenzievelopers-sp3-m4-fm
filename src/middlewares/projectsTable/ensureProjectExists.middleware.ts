import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { IError } from "../../interface/iDevelopers";
import { client } from "../../database";
import { IProjectTecResponseBody } from "../../interface/iProjects";

export const ensureProjectIdExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req.params.id;

  const queryString: string = `
      SELECT
          *
      FROM
        projects
      WHERE
        "id" = $1;
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IProjectTecResponseBody> = await client.query(
    queryConfig
  );

  if (queryResult.rowCount === 0) {
    const message: IError = {
      message: "Project not found.",
    };
    return res.status(404).json(message);
  }
  return next();
};
