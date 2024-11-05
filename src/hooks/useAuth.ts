import { AuthContext, AuthContextValue } from "@/context/auth";
import { useContext } from "react";

export default function useAuth(): [
  AuthContextValue["auth"],
  AuthContextValue["setAuth"],
] {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { auth, setAuth }: AuthContextValue = authContext;
  return [auth, setAuth];
}
