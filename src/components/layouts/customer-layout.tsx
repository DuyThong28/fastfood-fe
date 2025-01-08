import { ClipboardList, MapPin, UserRound } from "lucide-react";
import { routes } from "@/config";
import { useLocation, useNavigate } from "react-router-dom";
import ProductLayout from "./product-layout";
import UserHeader from "../shared/user-header";

const inActive =
  "flex items-center bg-white gap-3 rounded-lg px-3 py-2 text-[#A93F15] transition-all hover:text-[#FF7E00]";
const active =
  "flex items-center gap-3 rounded-lg bg-[#A93F15] px-3 py-2 text-white transition-all hover:text-white";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();

  return (
    <ProductLayout>
      <div className="w-full h-full grid-cols-[220px_1fr] hidden md:grid">
        <div className=" border-x bg-white">
          <div className="flex-1">
            <nav className="grid items-start  text-sm font-medium px-4 mt-6">
              <button
                onClick={() => navigate(routes.CUSTOMER.ACCOUNT_PROFILE)}
                className={
                  pathname === routes.CUSTOMER.ACCOUNT_PROFILE
                    ? active
                    : inActive
                }
              >
                <UserRound className="h-4 w-4" />
                Tài Khoản
              </button>
              <button
                onClick={() => navigate(routes.CUSTOMER.PURCHASE)}
                className={
                  pathname.includes(routes.CUSTOMER.PURCHASE)
                    ? active
                    : inActive
                }
              >
                <ClipboardList className="w-4 h-4" />
                Đơn Mua
              </button>
              <button
                onClick={() => navigate(routes.CUSTOMER.ACCOUNT_ADDRESS)}
                className={
                  pathname === routes.CUSTOMER.ACCOUNT_ADDRESS
                    ? active
                    : inActive
                }
              >
                <MapPin className="h-4 w-4" />
                Địa Chỉ
              </button>
            </nav>
          </div>
        </div>
        <div className="flex flex-col">{children}</div>
      </div>
      <UserHeader />
      <div className="flex-col md:hidden flex h-full overflow-y-auto pb-10">{children}</div>
    </ProductLayout>
  );
}
