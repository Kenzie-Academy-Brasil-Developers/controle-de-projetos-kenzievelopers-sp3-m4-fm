import { NextFunction, Request, Response } from "express";
import { IDevelopers, IError } from "../../interface/iDevelopers";
import { client } from "../../database";
import { QueryConfig, QueryResult } from "pg";

export const ensureDeveloperEmailExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const email = req.body.email;

  const queryString: string = `
    SELECT
        *
    FROM
        developers
    WHERE
        email=$1;
    `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [email],
  };

  const queryResult: QueryResult<IDevelopers> = await client.query(queryConfig);

  if (queryResult.rowCount >= 1) {
    const message: IError = {
      error: "Email already exists.",
    };
    return res.status(409).json(message);
  }

  return next();
};
