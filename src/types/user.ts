import { Gender } from "@/common/enums";
import { Respone, Meta } from "./api";

export interface User {
  fullName: string;
  password?: string;
  email: string;
  gender: Gender;
  birthday: Date | null;
}

export interface ResUser {
  password?: string;
  email: string;
  gender: Gender;
  birthday: Date | null;
  phone: number | undefined;
  full_name: string;
  avatar_url: string | undefined;
}

export interface Employee {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  birthday: Date | null;
  gender: Gender;
  avatar_url?: string;
  role: "STAFF";
  password: string;
}

export interface resEmployee extends Employee {
  is_disable: boolean;
  birthday: Date;
}

export interface CreateEmployee {
  role: "STAFF";
  password: string;
  email: string;
  gender: Gender;
  birthday: Date;
  phone: string | undefined;
  fullName: string;
}

export interface UpdateEmployee {
  id: string;
  role: "STAFF";
  email: string;
  gender: Gender;
  birthday: Date;
  phone: string | undefined;
  fullName: string;
}
export interface ResFetchAllEmployees extends Respone {
  data: {
    data: Array<Employee>;
    meta: Meta;
  };
}

export interface UserBasicInfo {
  full_name: string;
  avatar_url: string | undefined;
  email: string;
}
