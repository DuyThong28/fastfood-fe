import { ProductStatus } from "@/common/enums";
import { api } from "@/lib/api-client";
import { Page } from "@/types/api";
import {
  ProductQuery,
  CreateProductDetail,
  ResGetAllProducts,
  ResGetProductById,
  UpdateProductDetail,
} from "@/types/product";
import { trimObjectAttributes } from "@/utils/format";

class ProductService {
  async createProduct(data: CreateProductDetail) {
    const trimmedData = trimObjectAttributes(data);
    const formData = new FormData();
    formData.append("description", trimmedData.description);
    formData.append("categoryId", trimmedData.categoryId);
    formData.append("title", trimmedData.title);
    formData.append("price", trimmedData.price.toString());
    formData.append("stockQuantity", trimmedData.stockQuantity.toString());
    formData.append("entryPrice", trimmedData?.entryPrice.toString());
    formData.append("author", "John");
    if (trimmedData.images && trimmedData.images.length > 0) {
      trimmedData.images.forEach((image) => {
        formData.append("images", image);
      });
    }
    return api.post("/products/create", formData);
  }

  async getAllProducts(
    { page, take }: Page,
    query: ProductQuery,
  ): Promise<ResGetAllProducts> {
    let url = `/products/get-all?page=${page}&take=${take}`;
    const trimmedData = trimObjectAttributes(query);
    if (trimmedData?.status && trimmedData.status in ProductStatus) {
      url += `&status=${trimmedData.status}`;
    }
    if (trimmedData.title) {
      url += `&title=${trimmedData.title}`
    }
    if (trimmedData?.order)
      url += `&order=${trimmedData.order}`;
    if (trimmedData?.sortBy)
      url += `&sortBy=${trimmedData.sortBy}`;
    if (trimmedData?.max_price)
      url += `&max_price=${trimmedData.max_price}`;
    if (trimmedData?.min_price)
      url += `&min_price=${trimmedData.min_price}`;
    if (trimmedData?.min_star)
      url += `&min_star=${trimmedData.min_star}`;
    if (trimmedData?.categoryId)
      url += `&categoryId=${trimmedData.categoryId}`;
    if ("categoryStatus" in trimmedData)
      url += `&categoryStatus=${trimmedData.categoryStatus}`
    return api.get(url);
  }

  async getProductById(id: string): Promise<ResGetProductById> {
    return api.get(`products/get-one/${id}`);
  }

  async updateProductById(data: UpdateProductDetail) {
    const formData = new FormData();
    const trimmedData = trimObjectAttributes(data);
    formData.append("description", trimmedData.description);
    formData.append("categoryId", trimmedData.categoryId);
    formData.append("title", trimmedData.title);
    formData.append("price", trimmedData.price.toString());
    formData.append("stockQuantity", trimmedData.stockQuantity.toString());
    formData.append("entryPrice", trimmedData.entryPrice.toString());
    formData.append("author", "John");
    if (trimmedData.image_url && trimmedData.image_url.length > 0) {
      trimmedData.image_url.forEach((image) => {
        formData.append("image_url[]", image);
      });
    }

    if (trimmedData.images && trimmedData.images.length > 0) {
      trimmedData.images.forEach((image) => {
        formData.append("images_update", image);
      });
    }
    return api.patch(`/products/update/${trimmedData.id}`, formData);
  }

  async activeProductById(id: string) {
    return api.post(`/products/active/${id}`);
  }

  async inactiveProductById(id: string) {
    return api.post(`/products/inactive/${id}`);
  }
}

export default new ProductService();
