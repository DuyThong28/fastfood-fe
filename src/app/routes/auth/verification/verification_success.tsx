import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function VerificationSuccess() {
  return (
    <div className="h-[100vh] flex flex-col items-center justify-center gap-10">
      <span className="font-bold text-2xl">Xác minh thành công</span>
      <div className="flex flex-col">
        <span>
          Cảm ơn sự ủng hộ của bạn, chúng tôi đã xác minh email của bạn thành
          công.
        </span>
        <span className="text-center">
          Bây giờ bạn có thể đăng nhập vào tài khoản của mình.
        </span>
      </div>
      <Button>
        <Link to="/auth/sign-in">Đi đến trang đăng nhập</Link>
      </Button>
    </div>
  );
}
