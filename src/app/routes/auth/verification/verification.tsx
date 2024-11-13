import { Button } from "@/components/ui/button";
import authService from "@/services/auth.service";
import { MdMarkEmailUnread } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerificationRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const handleClickVerify = async () => {
    if (token) {
      try {
        await authService.verificationEmail({ token });
        navigate("/verification/success");
      } catch (err) {
        console.log(err);
        navigate("/verification/failed");
      }
    } else {
      console.error("Token is null");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-[100vh] gap-10">
      <MdMarkEmailUnread size={48} color="#4caf50" />
      <span className="text-2xl text-[#4caf50] font-bold">
      Xác minh tài khoản
      </span>
      <span className="font-bold">Bạn đã có tài khoản ProductNow</span>
      <div className="flex flex-col items-center gap-5">
        <span>Để tiếp tục:</span>
        <Button className="h-10" onClick={handleClickVerify}>
        Xác minh email của bạn tại đây
        </Button>
      </div>
    </div>
  );
}
