import { UserRole } from "@/common/enums";
import { JWTDecode } from "@/context/auth";
import useAuth from "@/hooks/useAuth";
import { getAccessToken } from "@/lib/api-client";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignInSuccess() {
  const [auth,setAuth] = useAuth();
  const navigate = useNavigate();
  const accessToken = getAccessToken();

  useEffect(()=>{
    if(accessToken){
        const { id, role }: JWTDecode = jwtDecode(accessToken);
        setAuth({
          userId: id,
          role,
        });
        if (role === UserRole.ADMIN) {
          navigate("/dashboad");
        } else if (role === UserRole.CUSTOMER) {
          navigate("/");
        }
    }

  },[accessToken]);

  return (
    <div className="h-[100vh] flex flex-col items-center justify-center gap-10">
      <span className="font-bold text-2xl">Login Success</span>
    </div>
  );
}
