export type Product = {
  id?: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  urlImage: string;
  visible?: boolean;
  user_id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: number;
}
