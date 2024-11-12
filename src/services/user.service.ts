import { api } from "@/lib/api-client";
import { Page } from "@/types/api";
import { ResFetchAllCustomers } from "@/types/customer";
import { CreateEmployee } from "@/types/user";

class UserService {
  async createEmployee(data: CreateEmployee) {
    return await api.post("/users/create", data);
  }

  async getAllStaff({page, take}: Page, disable: boolean| null, role = "STAFF"): Promise<ResFetchAllCustomers> {

    if(disable===true || disable===false){
      return api.get(`/users/get-all?page=${page}&take=${take}&disable=${disable}}&role=${role}`);
    } else {
      return api.get(`/users/get-all?page=${page}&take=${take}&role=${role}`);
    }
    
    }
    
    async searchStaff(disable:boolean| null, keyword: string, role = "STAFF"){
    if(disable===true || disable===false){
      return api.get(`/users/search?keyword=${keyword}&disable=${disable}&role=${role}`);
    } else {
      return api.get(`/users/search?keyword=${keyword}&role=${role}`);
    }
  }
}

export default new UserService();