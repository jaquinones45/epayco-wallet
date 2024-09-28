export class UpdateProductDto {
  id: number;
  name: string;
  price: number;
  quantity: number;
  urlImage: string;
  visible?: boolean;
}
