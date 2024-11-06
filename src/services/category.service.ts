import { api } from "@/lib/api-client";
import { Page } from "@/types/api";
import {  ResDisableCategoryById, ResEnableCategoryById, ResFetchAllCategories, ResGetCategoryById } from "@/types/category";

class CategryService {
  async createCategory(data: { name: string }) {
    return api.post("/categories/create", data);
  }

  async enableCategoryById(id: string):Promise<ResEnableCategoryById>{
    return api.post(`/categories/enable/${id}`);
  }

  async disableCategoryById(id: string):Promise<ResDisableCategoryById>{
    return api.post(`/categories/disable/${id}`);
  }

  async getAllCategories({page, take}: Page, disable: boolean| null): Promise<ResFetchAllCategories> {
    if(disable===true || disable===false){
      return api.get(`/categories/get-all?page=${page}&take=${take}&disable=${disable}`);
    } else {
      return api.get(`/categories/get-all?page=${page}&take=${take}`);
    }
  }
  async upDateCategory({id, name}:{id: string, name: string}) {
    return api.put(`/categories/update/${id}`,{name: name});
  }

  async getCategoryById(id: string): Promise<ResGetCategoryById> {
    return api.get(`/categories/get-one/${id}`);
  }

  async searchCategory(disable:boolean| null, query: string){
    if(disable===true || disable===false){
      return api.get(`/categories/search?query=${query}&disable=${disable}`);
    } else {
      return api.get(`/categories/search?query=${query}`);
    }
  }
}

export default new CategryService();
