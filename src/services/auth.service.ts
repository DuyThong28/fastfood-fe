import { api, getAccessToken, setAccessToken } from "@/lib/api-client";
import { ResetPassword } from "@/types/auth";
import { User } from "@/types/user";
import axios from "axios";
const URL_SERVER = import.meta.env.VITE_URL_SERVER;

class AuthService {

  async signUpByEmail(data: User) {
    return api.post("/auth/sign-up/email", data);
  }


  async verificationEmail(data: { token: string }) {
    return api.post("/auth/verify-email", data);
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
