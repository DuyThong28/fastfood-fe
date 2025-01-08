import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import {
  ClipboardList,
  LogOut,
  User,
  ShoppingCart,
  ShoppingCartIcon,
} from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { routes } from "@/config";
import useAuth from "@/hooks/useAuth";
import { UserRole } from "@/common/enums";
import authService from "@/services/auth.service";
import { removeAccessToken } from "@/lib/api-client";
import useUser from "@/hooks/useUser";
import { DEFAULT_AVATAR_URL } from "@/common/constants/user";
import { toastSuccess } from "@/utils/toast";

export default function UserDropDownMenu() {
  const [auth, setAuth] = useAuth();
  const [user] = useUser();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      const response = await authService.logOut();
      toastSuccess("Đăng xuất thành công");
      if (response) {
        setAuth(null);
        removeAccessToken();
        navigate(routes.AUTH.SIGN_IN);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full overflow-hidden aspect-square"
        >
          <img
            className="w-full h-full object-cover"
            src={user?.avatar_url ?? DEFAULT_AVATAR_URL}
          />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" align="end">
        <DropdownMenuLabel className="flex flex-row items-center">
          <div className="rounded-full overflow-hidden aspect-square h-7 w-7 mr-2">
            <img
              className="w-full h-full object-cover"
              src={user?.avatar_url ?? DEFAULT_AVATAR_URL}
            />
          </div>
          <span>{user?.full_name || ""}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {auth && auth.role === UserRole.CUSTOMER && (
          <DropdownMenuItem
            className="inline-flex md:hidden"
            onClick={() => navigate(routes.CUSTOMER.CART)}
          >
            <ShoppingCartIcon className="w-4 h-4 mr-2" />
            <span>Giỏ hàng</span>
          </DropdownMenuItem>
        )}
        {auth && auth.role === UserRole.ADMIN && (
          <DropdownMenuItem
            onClick={() => navigate(routes.ADMIN.ACCOUNT_PROFILE)}
          >
            <User className="w-4 h-4 mr-2" />
            <span>Tài khoản của tôi</span>
          </DropdownMenuItem>
        )}
        {auth && auth.role === UserRole.CUSTOMER && (
          <>
            <DropdownMenuItem
              onClick={() => navigate(routes.CUSTOMER.ACCOUNT_PROFILE)}
            >
              <User className="w-4 h-4 mr-2" />
              <span>Tài khoản của tôi</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate(routes.CUSTOMER.PURCHASE)}
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              <span>Đơn mua</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogOut}>
          <LogOut className="w-4 h-4 mr-2" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
