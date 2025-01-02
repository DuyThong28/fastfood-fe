import { api, getAccessToken, setAccessToken } from "@/lib/api-client";
import { ResetPassword } from "@/types/auth";
import { User } from "@/types/user";
import { trimObjectAttributes } from "@/utils/format";
import axios from "axios";
const URL_SERVER = import.meta.env.VITE_URL_SERVER;

class AuthService {
  async signInWithEmail(data: { email_phone: string; password: string }) {
    const trimmedData = trimObjectAttributes(data);
    return api.post("/auth/sign-in/email", {
      email: trimmedData.email_phone,
      password: trimmedData.password,
    });
  }
  async signUpByEmail(data: User) {
    const trimmedData = trimObjectAttributes(data);
    return api.post("/auth/sign-up/email", trimmedData);
  }

  async verificationEmail(data: { token: string }) {
    const trimmedData = trimObjectAttributes(data);
    return api.post("/auth/verify-email", trimmedData);
  }
  async logOut() {
    localStorage.removeItem("role");
    return api.delete("/auth/sign-out");
  }

  async forgotPassword(email: string) {
    return api.post("/auth/forgot-password", { email: email.trim() });
  }

  async resetPassword(data: ResetPassword) {
    const trimmedData = trimObjectAttributes(data);
    return api.post("auth/reset-password", trimmedData);
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
