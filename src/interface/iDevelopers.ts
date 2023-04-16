export interface IDevelopers {
  id: number;
  name: string;
  email: string;
}

export type TDevelopersRequestBody = Omit<IDevelopers, "id">;

export interface IError {
  message: string;
}
