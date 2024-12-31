import { api } from "@/lib/api-client";
import { Page } from "@/types/api";
import {
  ResDisableCategoryById,
  ResEnableCategoryById,
  ResFetchAllCategories,
  ResGetCategoryById,
} from "@/types/category";
import { trimObjectAttributes } from "@/utils/format";

class CategryService {
  async createCategory(data: { name: string }) {
    const trimmedData = trimObjectAttributes(data);
    return api.post("/categories/create", trimmedData);
  }

  async enableCategoryById(id: string): Promise<ResEnableCategoryById> {
    return api.post(`/categories/enable/${id}`);
  }

  async disableCategoryById(id: string): Promise<ResDisableCategoryById> {
    return api.post(`/categories/disable/${id}`);
  }

  async getAllCategories(
    { page, take }: Page,
    disable: boolean | null,
  ): Promise<ResFetchAllCategories> {
    if (disable === true || disable === false) {
      return api.get(
        `/categories/get-all?page=${page}&take=${take}&disable=${disable}`,
      );
    } else {
      return api.get(`/categories/get-all?page=${page}&take=${take}`);
    }
  }
  async upDateCategory(data: { id: string; name: string }) {
    const trimmedData = trimObjectAttributes(data);
    return api.put(`/categories/update/${trimmedData.id}`, {
      name: trimmedData.name,
    });
  }

  async getCategoryById(id: string): Promise<ResGetCategoryById> {
    return api.get(`/categories/get-one/${id}`);
  }

  async searchCategory(disable: boolean | null, query: string) {
    if (disable === true || disable === false) {
      return api.get(`/categories/search?query=${query}&disable=${disable}`);
    } else {
      return api.get(`/categories/search?query=${query.trim()}`);
    }
  }
}

export default new CategryService();
