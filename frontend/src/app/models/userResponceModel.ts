export interface IUserResponceModel {
  success: boolean;
  data: {
    name: string;
    role: string;
    token: string;
  };
  message?: string;
}
