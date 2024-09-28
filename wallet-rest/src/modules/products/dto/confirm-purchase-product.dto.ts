export type ConfirmPurchaseProductDto = {
  idSession: string;
  token: number;
  user_id: number;
  wallet_id: number;
  product_id: number;
}
