export interface iTechs {
  id?: number;
  name: string;
}

export type iTechResult = iTechs;

export interface IAddtechBodyRequest {
  projectId: number;
  technologyId: number;
  addedIn: Date;
}

// export interface iTechsPrejectRes extends iTechs, IProjectUpatedRequestBody {}
