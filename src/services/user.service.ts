import { api } from "@/lib/api-client";
import { Page } from "@/types/api";
import { ResFetchAllCustomers } from "@/types/customer";
import { CreateEmployee, UpdateEmployee } from "@/types/user";

class UserService {
  async createEmployee(data: CreateEmployee) {
    return await api.post("/users/create", data);
  }

  async getAllStaff(
    { page, take }: Page,
    disable: boolean | null,
    role = "STAFF",
  ): Promise<ResFetchAllCustomers> {
    if (disable === true || disable === false) {
      return api.get(
        `/users/get-all?page=${page}&take=${take}&disable=${disable}&role=${role}`,
      );
    } else {
      return api.get(`/users/get-all?page=${page}&take=${take}&role=${role}`);
    }
  }

  async searchStaff(disable: boolean | null, keyword: string, role = "STAFF") {
    console.log("searchStaff", disable);
    if (disable === true || disable === false) {
      return api.get(
        `/users/search?keyword=${keyword}&disable=${disable}&role=${role}`,
      );
    } else {
      return api.get(`/users/search?keyword=${keyword}&role=${role}`);
    }
  }
  async updateStaff(data: UpdateEmployee, image: File | null) {
    const formData = new FormData();
    if (data.birthday) {
      formData.append("birthday", data.birthday.toString());
    }
    formData.append("email", data.email);
    formData.append("full_name", data.fullName);
    formData.append("gender", data.gender);
    if(data.phone)
      formData.append("phone", data.phone);
    formData.append("role", data.role);
    formData.append("id", data.id);
    if (image) {
      formData.append("avatar_url", image);
    }
 
    return api.put(`/users/update-by-admin`, data);
  }
}

export default new UserService();
