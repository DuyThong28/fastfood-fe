import { Gender } from "@/common/enums";
import { Meta, Respone } from "./api";

export interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  birthday: Date;
  gender: Gender;
  is_disable: boolean;
  avatar_url?: string;
}

export interface ResFetchAllCustomers extends Respone {
  data: {
    data: Array<Customer>;
    meta: Meta;
  };
}
