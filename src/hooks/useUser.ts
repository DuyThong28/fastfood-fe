import { AuthContext, AuthContextValue } from "@/context/auth";
import { useContext } from "react";

export default function useUser(): [
  AuthContextValue["user"],
  AuthContextValue["setUser"],
] {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser }: AuthContextValue = authContext;
  return [user, setUser];
}
