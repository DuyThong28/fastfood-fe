import { Meta } from "./api";
import { ResProductDetail } from "./product";

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface ResCartItem {
  product_id: string;
  cart_id: number;
  id: number;
  quantity: number;
  product: ResProductDetail;
}

export interface ResGetCart {
  data: {
    data: Array<ResCartItem>;
    meta: Meta;
  };
}
