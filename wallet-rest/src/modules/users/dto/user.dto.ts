export type User = {
  id?: number;
  name: string;
  document: number;
  email: string;
  password: string;
  phone?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: number;
}
