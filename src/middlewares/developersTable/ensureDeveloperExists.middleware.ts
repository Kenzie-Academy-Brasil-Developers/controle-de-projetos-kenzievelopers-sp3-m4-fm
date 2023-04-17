import { NextFunction, Request, Response } from "express";
import { IDevelopers, IError } from "../../interface/iDevelopers";
import { client } from "../../database";
import { QueryConfig, QueryResult } from "pg";

export const ensureDeveloperExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req.params.id;

  const queryString: string = `
      SELECT
          *
      FROM
          developers
      WHERE
          id=$1;
      `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDevelopers> = await client.query(queryConfig);
  const developer: IDevelopers = queryResult.rows[0];

  if (queryResult.rowCount === 0) {
    const message: IError = {
      message: "Developer not found.",
    };
    return res.status(404).json(message);
  }
  res.locals.developer = developer;
  return next();
};
