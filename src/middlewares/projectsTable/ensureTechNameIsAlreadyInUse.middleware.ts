import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../../database";
import {
  IAddtechBodyRequest,
  iTechResult,
  iTechs,
} from "../../interface/iProjectTech";
import { IError } from "../../interface/iDevelopers";

export const ensureTechNameIsAlreadyInUseMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const name: string = req.body.name;
  const projId: number = parseInt(req.params.id);

  const queryString: string = `
    SELECT 
         *
    FROM
         technologies
    WHERE   
         name = $1;
`;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [name],
  };

  const queryResult: QueryResult<iTechs> = await client.query(queryConfig);

  const techId: number | undefined = queryResult.rows[0].id;

  const queryTemplate: string = `
          SELECT 
              *
          FROM
              projects_technologies
          WHERE   
              "technologyId" = $1
          AND
              "projectId" =$2;
          `;

  const queryConfigTemplate: QueryConfig = {
    text: queryTemplate,
    values: [techId, projId],
  };

  const queryResultTemplate: QueryResult<IAddtechBodyRequest> =
    await client.query(queryConfigTemplate);

  if (queryResultTemplate.rowCount > 0) {
    const message: IError = {
      message: "This technology is already associated with the project",
    };
    return res.status(409).json(message);
  }

  return next();
};
