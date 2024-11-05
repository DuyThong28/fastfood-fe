import { api, getAccessToken, setAccessToken } from "@/lib/api-client";
import { ResetPassword } from "@/types/auth";
import { User } from "@/types/user";
import axios from "axios";
const URL_SERVER = import.meta.env.VITE_URL_SERVER;

class AuthService {
  async signInWithEmail(data: { email_phone: string; password: string }) {
    return api.post("/auth/sign-in/email", {
      email: data.email_phone,
      password: data.password,
    });
  }
  async singInWithPhone(data: { email_phone: string; password: string }) {
    return api.post("/auth/sign-in/phone", {
      phone: data.email_phone,
      password: data.password,
    });
  }

  async signUpByEmail(data: User) {
    return api.post("/auth/sign-up/email", data);
  }

  async verificationEmail(data: { token: string }) {
    return api.post("/auth/verify-email", data);
  }

  async forgotPassword(email: string) {
    return api.post("/auth/forgot-password", { email: email });
  }

  async resetPassword({ email, newPassword, code }: ResetPassword) {
    return api.post("auth/reset-password", {
      email,
      newPassword,
      code,
    });
  }
  async logOut() {
    return api.delete("/auth/sign-out");
  }
  
  async refreshAccessToken(): Promise<string> {
    const token = getAccessToken();
    if (!token) throw new Error("No refresh token available");

    const response = await axios.get(`${URL_SERVER}/auth/refresh-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    const newAccessToken = response.data.access_token;
    setAccessToken(newAccessToken);
    return newAccessToken;
  }
}

export default new AuthService();
