import { api } from "@/lib/api-client";
import { Page } from "@/types/api";
import { ResFetchAllCustomers } from "@/types/customer";
import { ResUser } from "@/types/user";

class CustomerService {
  async getAllCusomter({page, take}: Page, disable: boolean| null): Promise<ResFetchAllCustomers> {

    if(disable===true || disable===false){
      return api.get(`/users/get-all?page=${page}&take=${take}&disable=${disable}`);
    } else {
      return api.get(`/users/get-all?page=${page}&take=${take}`);
    }
    
  }
  async enableCustomerById(id: string) {
    return api.post(`/users/${id}/enable`);
  }

  async disablecustomerById(id: string) {
    return api.post(`/users/${id}/disable`);
  }

  async getAccountById(id: string) {
    return api.get(`/users/get-one/${id}`);
  }

  async updateAccount(data: ResUser, imageFile: File | null) {
    const formData = new FormData();
    if (data.birthday) formData.append("birthday", data.birthday?.toString());
    formData.append("email", data.email);
    formData.append("fullName", data.full_name);
    formData.append("gender", data.gender);
    if (data.phone) formData.append("phone", data.phone?.toString());
    if (imageFile) {
      formData.append("avatar_url", imageFile);
    }
    return api.patch(`/users/update`, formData);
  }

  async searchCustomer(disable:boolean| null, keyword: string){
    if(disable===true || disable===false){
      return api.get(`/users/search?keyword=${keyword}&disable=${disable}`);
    } else {
      return api.get(`/users/search?keyword=${keyword}`);
    }
  }
}

export default new CustomerService();
