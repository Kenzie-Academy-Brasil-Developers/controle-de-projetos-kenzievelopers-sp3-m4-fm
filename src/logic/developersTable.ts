import { Request, Response } from "express";
import { client } from "../database";
import { IDevelopers, TDevelopersRequestBody } from "../interface/iDevelopers";
import format, { string } from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import {
  IDeveloperInfo,
  IDeveloperResponse,
} from "../interface/iDeveloperInfos";

export const createDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developersData: TDevelopersRequestBody = req.body;
  const queryString: string = format(
    `
INSERT INTO 
    developers
(%I)
    VALUES
(%L)
    RETURNING *;
`,
    Object.keys(developersData),
    Object.values(developersData)
  );
  const queryResult: QueryResult<IDevelopers> = await client.query(queryString);
  return res.status(201).json(queryResult.rows[0]);
};

export const listDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  const queryString: string = `
SELECT
dev."id" AS "developerId",
dev."name" AS "developerName",
dev."email" AS "developerEmail",
"devInf"."developerSince" AS "developerInfoDeveloperSince",
"devInf"."preferredOS" AS "developerInfoPreferredOS"
FROM
  developer_infos "devInf"
RIGHT JOIN
  developers dev ON "devInf"."developerId" = dev."id"
WHERE dev."id"=$1;
`;
  const queryResult: QueryResult<IDeveloperInfo> = await client.query(
    queryString,
    [id]
  );

  return res.json(queryResult.rows[0]);
};

export const updateDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const developerData: TDevelopersRequestBody = req.body;
  const id: number = parseInt(req.params.id);

  const queryString: string = format(
    `
UPDATE
  developers
  SET(%I)=ROW(%L)
WHERE
    id = $1
RETURNING *;
`,
    Object.keys(developerData),
    Object.values(developerData)
  );
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };
  const queryResult: QueryResult<IDevelopers> = await client.query(queryConfig);

  return res.json(queryResult.rows[0]);
};

export const deleteDeveloper = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const id: number = parseInt(req.params.id);

  const querryString: string = `
  DELETE FROM
    developers
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

export const createDeveloperInfo = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const id = parseInt(req.params.id);
    const developerInfoData = {
      developerSince: req.body.developerSince,
      preferredOS: req.body.preferredOS,
      developerId: id,
    };
    const queryString: string = format(
      `
  INSERT INTO 
    developer_infos
  (%I)
    VALUES
  (%L)
    RETURNING *;
`,
      Object.keys(developerInfoData),
      Object.values(developerInfoData)
    );
    const queryResult: QueryResult<IDeveloperResponse> = await client.query(
      queryString
    );

    return res.status(201).json(queryResult.rows[0]);
  } catch (error) {
    if (error instanceof Error) {
      const developerInfoData = {
        preferredOS: req.body.preferredOS,
      };
      return res.status(400).json({
        message: "Invalid OS option",
        options: `${developerInfoData.preferredOS}`,
      });
    }
    return res.status(500).json({ message: error });
  }
};
