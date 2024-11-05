import { ResBookDetail } from "./book";

export interface Review {
  book?: ResBookDetail;
  orderId: string;
  orderDetailId: string;
  bookId: string;
  star: number;
  description: string| undefined;
  title: string;
}
