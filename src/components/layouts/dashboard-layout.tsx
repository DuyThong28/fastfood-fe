import {
  Grid2x2,
  Home,
  MessageSquareMore,
  Package,
  Package2,
  ShoppingCart,
  UserRound,
  Users,
  ChartColumnIncreasing,
} from "lucide-react";
import { routes } from "@/config";
import { useLocation, useNavigate } from "react-router-dom";
import UserDropDownMenu from "../shared/user-drop-down-menu";
import Logo from "../../assets/logo.svg";

const inActive =
  "flex items-center gap-3 rounded-lg bg-transparent px-3 py-2 text-[#A93F15] transition-all hover:text-[#FF7E00]";
const active =
  "flex items-center gap-3 rounded-lg bg-[#A93F15] px-3 py-3 text-white transition-all hover:text-[#FF7E00]";

export default function DashBoardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const onlyAdmin = role === "ADMIN";

  return (
    <div className="grid min-h-screen w-full grid-cols-[220px_1fr]">
      <div className=" border-r">
        <div className="flex h-full max-h-screen w-56 flex-col gap-6">
          <div className="flex items-center h-[60px] px-6">
            <button
              onClick={() => navigate(routes.ADMIN.DASHBOAD)}
              className="flex items-center gap-2 font-semibold"
            >
              <img src={Logo} className="w-36" />
            </button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 gap-y-3 text-sm font-medium lg:px-4">
              <button
                onClick={() => navigate(routes.ADMIN.DASHBOAD)}
                className={
                  pathname === routes.ADMIN.DASHBOAD ? active : inActive
                }
              >
                <Home className="h-4 w-4" />
                Trang Chủ
              </button>

              {onlyAdmin && (
                <button
                  onClick={() => navigate(routes.ADMIN.PRODUCT)}
                  className={
                    pathname === routes.ADMIN.PRODUCT ? active : inActive
                  }
                >
                  <Package className="h-4 w-4" />
                  Quản Lý Sản Phẩm
                </button>
              )}
              {onlyAdmin && (
                <button
                  onClick={() => navigate(routes.ADMIN.CATEGORY)}
                  className={
                    pathname === routes.ADMIN.CATEGORY ? active : inActive
                  }
                >
                  <Grid2x2 className="h-4 w-4" />
                  Quản Lý Danh Mục
                </button>
              )}
              {onlyAdmin && (
                <button
                  onClick={() => navigate(routes.ADMIN.ORDER)}
                  className={
                    pathname === routes.ADMIN.ORDER ? active : inActive
                  }
                >
                  <ShoppingCart className="h-4 w-4" />
                  Quản Lý Đơn Hàng
                </button>
              )}
              {onlyAdmin && (
                <button
                  onClick={() => navigate(routes.ADMIN.REVIEW)}
                  className={
                    pathname === routes.ADMIN.REVIEW ? active : inActive
                  }
                >
                  <MessageSquareMore className="h-4 w-4" />
                  Quản Lý Đánh Giá
                </button>
              )}
              <button
                onClick={() => navigate(routes.ADMIN.CUSTOMER)}
                className={
                  pathname === routes.ADMIN.CUSTOMER ? active : inActive
                }
              >
                <Users className="h-4 w-4" />
                Quản Lý Khách Hàng
              </button>
              {onlyAdmin && (
                <button
                  onClick={() => navigate(routes.ADMIN.EMPLOYEE)}
                  className={
                    pathname === routes.ADMIN.EMPLOYEE ? active : inActive
                  }
                >
                  <Users className="h-4 w-4" />
                  Quản Lý Nhân Viên
                </button>
              )}
              <button
                onClick={() => navigate(routes.ADMIN.REPORT)}
                className={pathname === routes.ADMIN.REPORT ? active : inActive}
              >
                <ChartColumnIncreasing className="h-4 w-4" />
                Báo Cáo
              </button>
              <button
                onClick={() => navigate(routes.ADMIN.ACCOUNT_PROFILE)}
                className={
                  pathname === routes.ADMIN.ACCOUNT_PROFILE ? active : inActive
                }
              >
                <UserRound className="h-4 w-4" />
                Tài Khoản
              </button>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col h-screen w-full bg-[#FFFBF7] overflow-hidden">
        <header className="flex justify-end  h-[60px] items-center gap-4 border-b bg-white px-6 ">
          <UserDropDownMenu />
        </header>
        {children}
      </div>
    </div>
  );
}
