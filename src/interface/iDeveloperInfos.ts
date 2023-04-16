export interface IDeveloperInfo {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince?: Date | null;
  developerInfoPreferredOS?: string | null;
}

export interface IDeveloperInfoRequestBody {
  developerSince: Date;
  preferredOS: "Windows" | "Linux" | "MacOS";
}

export interface IDeveloperResponse {
  id: number;
  developerSince: Date;
  preferredOS: string;
  developerId?: number;
}
