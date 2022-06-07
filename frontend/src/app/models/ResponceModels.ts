export interface IUserResponceModel {
  success: boolean;
  data: {
    name: string;
    role: string;
    token: string;
  };
  message?: string;
}

export interface IItemsResponceModel {
  success: boolean;
  transactions?: ITransaction[];
  categories?: ICategory[];
  subscriptions?: ISubscription[];
  message?: string;
}

export interface ITransaction {
  user: string;
  card: string;
  title: string;
  categories: {
    _id: string;
    name: string;
    type: string;
  }[];
  amount: number;
  date: Date;
  description: string;
  attachment: string;
  payee: string;
  type: string;
}

export interface ICategory {
  name: string;
  type: string;
  _id: string;
}

export interface ISubscription {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  amount: number;
  categoryList: ICategory[];
  _id: string;
  payee: string;
  nextPaymentDate: Date;
  durationNumber: number;
}
