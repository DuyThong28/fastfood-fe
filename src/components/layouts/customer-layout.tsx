import { MapPin, ShoppingCart, UserRound } from "lucide-react";
import { routes } from "@/config";
import { useLocation } from "react-router-dom";
import ProductLayout from "./product-layout";

const inActive =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
const active =
  "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { pathname } = location;

  return (
    <ProductLayout>
      <div className="grid w-full grid-cols-[220px_1fr]">
        <div className=" border-x bg-white">
          <div className="flex-1">
            <nav className="grid items-start  text-sm font-medium px-4 mt-6">
              <a
                href={routes.CUSTOMER.ACCOUNT_PROFILE}
                className={
                  pathname === routes.CUSTOMER.ACCOUNT_PROFILE
                    ? active
                    : inActive
                }
              >
                <UserRound className="h-4 w-4" />
                Tai khoan
              </a>
              <a
                href={routes.CUSTOMER.PURCHASE}
                className={
                  pathname.includes(routes.CUSTOMER.PURCHASE)
                    ? active
                    : inActive
                }
              >
                <ShoppingCart className="h-4 w-4" />
                Don Mua
              </a>
              <a
                href={routes.CUSTOMER.ACCOUNT_ADDRESS}
                className={
                  pathname === routes.CUSTOMER.ACCOUNT_ADDRESS
                    ? active
                    : inActive
                }
              >
                <MapPin className="h-4 w-4" />
                Dia Chi
              </a>
            </nav>
          </div>
        </div>
        <div className="flex flex-col">{children}</div>
      </div>
    </ProductLayout>
  );
}
