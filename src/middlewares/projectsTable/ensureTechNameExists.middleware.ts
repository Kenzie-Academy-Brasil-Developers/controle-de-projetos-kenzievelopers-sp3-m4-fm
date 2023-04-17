import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../../database";
import { iTechResult, iTechs } from "../../interface/iProjectTech";

export const ensureTechNameExists = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const techBody: iTechs = req.body;

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
    values: [techBody.name],
  };

  const queryResult: QueryResult<iTechResult> = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    const firstRow = queryResult.rows[0];
    res.locals.tech = {
      techId: Number(firstRow.id),
    };
  } else {
    return res.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }
  return next();
};
