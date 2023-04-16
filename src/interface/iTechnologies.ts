export interface ITechnology {
  id: number;
  name: string;
}

export type TTechnologyRequestBody = Omit<ITechnology, "id">;
