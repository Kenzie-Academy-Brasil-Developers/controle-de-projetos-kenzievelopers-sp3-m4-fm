import { QueryConfig, QueryResult } from "pg";
import { IError } from "../../interface/iDevelopers";
import { IDeveloperResponse } from "../../interface/iDeveloperInfos";
import { client } from "../../database";
import { NextFunction, Request, Response } from "express";

export const ensureDeveloperInfoExistsMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const id = req.params.id;

  const queryString: string = `
            SELECT
                *
            FROM
                 "developer_infos"
            WHERE
            "developerId" = $1;
            `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<IDeveloperResponse> = await client.query(
    queryConfig
  );

  if (queryResult.rowCount >= 1) {
    const message: IError = {
      error: "Developer info already exists.",
    };
    return res.status(409).json(message);
  }

  return next();
};
