import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { IDevelopers, IError } from "../../interface/iDevelopers";
import { client } from "../../database";

export const ensureDeveloperIdExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let id: number = parseInt(req.params.id);

  if (req.route.path === "/projects" && req.method === "POST") {
    id = req.body.developerId;
  } else if (req.route.path === "/projects/:id" && req.method === "PATCH") {
    id = req.body.developerId;
  }

  const queryString: string = `
      SELECT
          *
      FROM
          developers 
      WHERE
          "id" = $1;
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDevelopers> = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return res.status(404).json({
      message: "Developer not found",
    });
  }

  res.locals.project = queryResult.rows[0];

  return next();
};
