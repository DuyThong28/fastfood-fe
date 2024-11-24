import { ProductStatus } from "@/common/enums";
import { Meta } from "./api";
import { Category } from "./category";

export interface Product {
  title: string;
  price: number;
  description: string;
  author?: string;
}

export interface ProductDetail extends Product {
  entryPrice: number;
  description: string;
  stockQuantity: number;
  categoryId: string;
}

export interface CreateProductDetail extends ProductDetail {
  images: Array<File>;
}

export interface UpdateProductDetail extends CreateProductDetail {
  id: string;
  image_url: string[];
  initCategory: Category | null
}

export interface ResProductDetail extends Product {
  status: ProductStatus;
  image_url: string[];
  id: string;
  entry_price: number;
  stock_quantity: number;
  category_id: string;
  sold_quantity: number;
  total_reviews: number;
  avg_stars: number;
  Category?: Category
}

export interface ResGetAllProducts extends Response {
  data: {
    data: Array<ResProductDetail>;
    meta: Meta;
  };
}

export interface ResGetProductById extends Response {
  data: {
    data: ResProductDetail;
  };
}

export interface ProductQuery {
  status?: string,
  order?: string,
  sortBy?: string,
  title?: string,
  min_price?: number;
  max_price?: number;
  min_star?: number;
  categoryId?: string
  categoryStatus?: boolean
}
