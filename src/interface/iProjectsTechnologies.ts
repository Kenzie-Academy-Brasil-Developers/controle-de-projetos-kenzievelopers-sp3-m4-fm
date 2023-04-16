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
