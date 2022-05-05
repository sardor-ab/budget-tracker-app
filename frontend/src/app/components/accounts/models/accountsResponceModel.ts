export interface AccountsResponce {
  success: boolean;
  data?: {
    user: string;
    title: string;
    balance: number;
    currency: string;
    type: string;
  }[];
  message?: string;
}
