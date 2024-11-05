import { Meta } from "./api";
import { ResBookDetail } from "./book";

export interface CartItem {
  bookId: string;
  quantity: number;
}

export interface ResCartItem {
  book_id: string;
  cart_id: number;
  id: number;
  quantity: number;
  book: ResBookDetail;
}

export interface ResGetCart {
  data: {
    data: Array<ResCartItem>;
    meta: Meta;
  };
}
