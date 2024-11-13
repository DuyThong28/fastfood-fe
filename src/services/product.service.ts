import { ProductStatus } from "@/common/enums";
import { api } from "@/lib/api-client";
import { Page } from "@/types/api";
import { CreateProductDetail, ProductQuery, ResGetAllProducts, ResGetProductById, UpdateProductDetail } from "@/types/product";


class ProductService {
  async createProduct(data: CreateProductDetail) {
    const formData = new FormData();
    formData.append("description", data.description);
    formData.append("categoryId", data.categoryId);
    formData.append("title", data.title);
    formData.append("price", data.price.toString());
    formData.append("stockQuantity", data.stockQuantity.toString());
    formData.append("entryPrice", data?.entryPrice.toString());
    formData.append("author", "John");
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
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
    if (query?.status && query.status in ProductStatus) {
      url += `&status=${query.status}`;
    }
    if (query.title) {
      url += `&title=${query.title}`
    }
    if (query?.order)
      url += `&order=${query.order}`;
    if (query?.sortBy)
      url += `&sortBy=${query.sortBy}`;
    if (query?.max_price)
      url += `&max_price=${query.max_price}`;
    if (query?.min_price)
      url += `&min_price=${query.min_price}`;
    if (query?.min_star)
      url += `&min_star=${query.min_star}`;
    if (query?.categoryId)
      url += `&categoryId=${query.categoryId}`;
    return api.get(url);
  }

  async getProductById(id: string): Promise<ResGetProductById> {
    return api.get(`products/get-one/${id}`);
  }

  async updateProductById(data: UpdateProductDetail) {
    const formData = new FormData();
    formData.append("description", data.description);
    formData.append("categoryId", data.categoryId);
    formData.append("title", data.title);
    formData.append("price", data.price.toString());
    formData.append("stockQuantity", data.stockQuantity.toString());
    formData.append("entryPrice", data.entryPrice.toString());
    formData.append("author", "John");
    if (data.image_url && data.image_url.length > 0) {
      data.image_url.forEach((image) => {
        formData.append("image_url[]", image);
      });
    }

    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append("images_update", image);
      });
    }
    return api.patch(`/products/update/${data.id}`, formData);
  }

  async activeProductById(id: string) {
    return api.post(`/products/active/${id}`);
  }

  async inactiveProductById(id: string) {
    return api.post(`/products/inactive/${id}`);
  }
}

export default new ProductService();
