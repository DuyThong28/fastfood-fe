import { BookStatus } from "@/common/enums";
import { api } from "@/lib/api-client";
import { Page } from "@/types/api";
import {
  BookQuery,
  CreateBookDetail,
  ResGetAllBooks,
  ResGetBookById,
  UpdateBookDetail,
} from "@/types/book";

class BookService {
  async createBook(data: CreateBookDetail) {
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
    return api.post("/books/create", formData);
  }

  async getAllBooks(
    { page, take }: Page,
    query: BookQuery,
  ): Promise<ResGetAllBooks> {
    let url = `/books/get-all?page=${page}&take=${take}`;
    if (query?.status && query.status in BookStatus) {
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
    if (query?.category)
      url += `&categoryId=${query.categoryId}`;
    return api.get(url);
  }

  async getBookById(id: string): Promise<ResGetBookById> {
    return api.get(`books/get-one/${id}`);
  }

  async updateBookById(data: UpdateBookDetail) {
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
    return api.patch(`/books/update/${data.id}`, formData);
  }

  async activeBookById(id: string) {
    return api.post(`/books/active/${id}`);
  }

  async inactiveBookById(id: string) {
    return api.post(`/books/inactive/${id}`);
  }
}

export default new BookService();
