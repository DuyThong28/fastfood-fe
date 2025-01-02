import {
  createContext,
  FC,
  ReactNode,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";
import { getAccessToken } from "@/lib/api-client";
import customerService from "@/services/customer.service";
import { UserBasicInfo } from "@/types/user";

export interface AuthState {
  userId: string;
  role: string;
}

export interface AuthContextValue {
  auth: AuthState | null;
  setAuth: Dispatch<SetStateAction<AuthState | null>>;
  user: UserBasicInfo | null;
  setUser: Dispatch<SetStateAction<UserBasicInfo | null>>;
}

export interface JWTDecode {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserBasicInfo | null>(null);
  const [auth, setAuth] = useState<AuthState | null>(() => {
    const token: string | null = getAccessToken();
    if (token) {
      try {
        const { id, role }: JWTDecode = jwtDecode(token);
        return {
          userId: id,
          role: role,
        };
      } catch (err) {
        console.log(err);
      }
    }
    return null;
  });

  const fetchUser = async (id: string) => {
    try {
      const response = await customerService.getAccountById(id);
      setUser({
        full_name: response.data.data.full_name,
        avatar_url: response.data.data.avatar_url,
        email: response.data.data.email,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (auth?.userId) {
      fetchUser(auth.userId);
    } else {
      setUser(null);
    }
  }, [auth]);

  const value: AuthContextValue = { auth, setAuth, user, setUser };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
