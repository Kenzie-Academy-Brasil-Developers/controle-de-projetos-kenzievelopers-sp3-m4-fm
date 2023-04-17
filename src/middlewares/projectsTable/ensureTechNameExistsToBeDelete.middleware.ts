import { NextFunction, Request, Response } from "express";
import { QueryConfig } from "pg";
import { client } from "../../database";

export const ensureTechNameExistsToBeDeleteMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  let techFromRequest = req.body;

  if (Object.keys(techFromRequest).length === 0) {
    techFromRequest = req.params;
  }

  const queryStringToFindTechnologyId = `
        SELECT * FROM technologies WHERE name = $1;
    `;

  const queryConfigToFindTechnologyId: QueryConfig = {
    text: queryStringToFindTechnologyId,
    values: [techFromRequest.name],
  };

  const queryResultToFindTechnologyId = await client.query(
    queryConfigToFindTechnologyId
  );

  if (queryResultToFindTechnologyId.rowCount <= 0) {
    const queryDisposableTechnologiesString = `
            SELECT * FROM technologies;
        `;

    const queryResult = await client.query(queryDisposableTechnologiesString);

    const availableTechs = queryResult.rows.map((e) => {
      return e.name;
    });

    return res.status(400).json({
      message: "Technology not supported.",
      options: availableTechs,
    });
  }

  res.locals.queryResult = queryResultToFindTechnologyId.rows[0].id;

  next();
};
