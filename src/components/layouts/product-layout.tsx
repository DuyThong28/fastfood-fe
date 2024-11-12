import { Button } from "@/components/ui/button";
import {  Search, ShoppingCart } from "lucide-react";
import UserDropDownMenu from "../shared/user-drop-down-menu";
import { useNavigate } from "react-router-dom";
import { routes } from "@/config";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigation = useNavigate();
  return (
    <div className="h-screen w-full grid grid-rows-[96px_1fr]">
      <div className="px-40 h-full w-full flex flex-row items-center bg-black gap-16">
        <a href="/" className="text-white text-nowrap  text-2xl font-bold">
          Food Now
        </a>

        <div className="flex  w-full rounded-sm items-center space-x-2 bg-white p-[2px]">
          <input
            className="w-full pl-2"
            type="text"
            placeholder="Tim mon an..."
          />
          <Button className="rounded-sm" type="submit">
            <Search className="w-6 h-6 text-white" />
          </Button>
        </div>
        <div className="flex flex-row gap-4 w-fit items-center">
          <div className="w-11" onClick={()=> navigation(routes.CUSTOMER.CART)}>
            <ShoppingCart className="h-7 w-7 text-white" />
          </div>
          <div className="w-11">
            <UserDropDownMenu />
          </div>
        </div>
      </div>
      <div className="px-40 flex flex-col gap-6 bg-[#f9f9f9] overflow-y-auto">{children}</div>
    </div>
  );
}
