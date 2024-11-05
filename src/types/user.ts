import { Gender } from "@/common/enums";

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