export type TProjectRequestBodyWithEndDate = {
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date | null;
  developerId: number;
};

export type TProjectRequestBodyWithoutEndDate = Omit<
  TProjectRequestBodyWithEndDate,
  "endDate"
>;

export type TProjectResponseBodyWithEndDate = TProjectRequestBodyWithEndDate & {
  id: number;
};

export type TProjectResponseBodyWithoutEndDate = Omit<
  TProjectResponseBodyWithEndDate,
  "endDate"
>;

export interface IProjectUpatedRequestBody {
  name?: string;
  description?: string;
  estimatedTime?: string;
  repository?: string;
  startDate?: Date;
  endDate?: Date | null;
  developerId?: number;
}

export interface IProjectTecResponseBody {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: string;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate: Date | null;
  projectDeveloperId: number;
  technologyId: number | null;
  technologyName: string | null;
}
