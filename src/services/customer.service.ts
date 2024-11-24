import { api } from "@/lib/api-client";
import { Page } from "@/types/api";
import { ResFetchAllCustomers } from "@/types/customer";
import { ResUser } from "@/types/user";
import { trimObjectAttributes } from "@/utils/format";

class CustomerService {
  async getAllCusomter({ page, take }: Page, disable: boolean | null): Promise<ResFetchAllCustomers> {

    if (disable === true || disable === false) {
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

  async getAccountById(id: string): Promise<{ data: { data: ResUser } }> {
    return api.get(`/users/get-one/${id}`);
  }

  async updateAccount(data: ResUser, imageFile: File | null): Promise<{
    data: {
      data: ResUser
    }
  }> {
    const formData = new FormData();
    const trimmedData = trimObjectAttributes(data);
    if (trimmedData.birthday) formData.append("birthday", trimmedData.birthday?.toString());
    formData.append("email", trimmedData.email);
    formData.append("fullName", trimmedData.full_name);
    formData.append("gender", trimmedData.gender);
    if (trimmedData.phone) formData.append("phone", trimmedData.phone?.toString());
    if (imageFile) {
      formData.append("avatar_url", imageFile);
    }
    return api.patch(`/users/update`, formData);
  }

  async searchCustomer(disable: boolean | null, keyword: string) {
    if (disable === true || disable === false) {
      return api.get(`/users/search?keyword=${keyword}&disable=${disable}`);
    } else {
      return api.get(`/users/search?keyword=${keyword}`);
    }
  }

}

export default new CustomerService();

