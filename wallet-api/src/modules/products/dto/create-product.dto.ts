export class CreateProductDto {
  name: string;
  price: number;
  quantity: number;
  urlImage: string;
  visible?: boolean;
}
