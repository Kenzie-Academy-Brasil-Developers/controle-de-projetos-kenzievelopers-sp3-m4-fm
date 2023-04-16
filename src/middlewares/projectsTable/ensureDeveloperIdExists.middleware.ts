import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import {
  TProjectResponseBodyWithEndDate,
  TProjectResponseBodyWithoutEndDate,
} from "../../interface/iProjects";
import { IError } from "../../interface/iDevelopers";
import { client } from "../../database";

export const ensureDeveloperIdExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req.body.id;

  const queryString: string = `
      SELECT
          *
      FROM
        projects
      WHERE
        "developerId" = $1;
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<
    TProjectResponseBodyWithoutEndDate | TProjectResponseBodyWithEndDate
  > = await client.query(queryConfig);
  const project:
    | TProjectResponseBodyWithoutEndDate
    | TProjectResponseBodyWithEndDate = queryResult.rows[0];

  if (queryResult.rowCount === 0) {
    const message: IError = {
      error: "Developer no found.",
    };
    return res.status(404).json(message);
  }
  res.locals.project = project;
  return next();
};
