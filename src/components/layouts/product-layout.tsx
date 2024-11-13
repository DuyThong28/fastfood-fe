import { Button } from "@/components/ui/button";
import { Search, ShoppingCart } from "lucide-react";
import UserDropDownMenu from "../shared/user-drop-down-menu";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "@/config";
import {
  forwardRef,
  KeyboardEvent,
  useImperativeHandle,
  useState,
} from "react";

export interface ProductLayoutRef {
  getSearchText: () => string;
  setSearchText: (value: string) => void;
}

export interface ProductLayoutProps {
  children: React.ReactNode;
}

const ProductLayout = forwardRef<ProductLayoutRef, ProductLayoutProps>(
  function ProductLayout({ children }, ref) {
    const [searchText, setSearchText] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();

    useImperativeHandle(ref, () => {
      return {
        getSearchText() {
          return searchText;
        },
        setSearchText(value: string) {
          setSearchText(value);
        },
      };
    });

    const handleSearch = () => {
      if (location.pathname !== routes.CUSTOMER.HOME) {
        if (searchText !== "")
          navigate(`${routes.CUSTOMER.HOME}?title=${searchText}`);
        else {
          navigate(`${routes.CUSTOMER.HOME}`);
        }
      } else {
        const searchParams = new URLSearchParams(location.search);
        const param = Object.fromEntries(searchParams.entries());
        const newParams = { ...param, title: searchText };
        const newSearchParams = new URLSearchParams();
        Object.entries(newParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            newSearchParams.set(key, String(value));
          }
        });

        const paramString = newSearchParams.toString();
        const url = paramString
          ? `${location.pathname}?${paramString}`
          : location.pathname;

        navigate(url);
      }
    };

    const handleEnterPress = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        handleSearch();
      }
    };

    return (
      <div className="h-screen w-full grid grid-rows-[96px_1fr]">
        <div className="px-40 h-full w-full flex flex-row items-center bg-black gap-16">
          <a href="/" className="text-white text-nowrap  text-2xl font-bold">
            Product Now
          </a>

          <div className="flex  w-full rounded-sm items-center space-x-2 bg-white p-[2px]">
            <input
              className="w-full pl-2"
              type="search"
              placeholder="Tim sach..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleEnterPress}
            />
            <Button className="rounded-sm" onClick={handleSearch}>
              <Search className="w-6 h-6 text-white" />
            </Button>
          </div>
          <div className="flex flex-row gap-4 w-fit items-center">
            <div
              className="w-11"
              onClick={() => navigate(routes.CUSTOMER.CART)}
            >
              <ShoppingCart className="h-7 w-7 text-white" />
            </div>
            <div className="w-11">
              <UserDropDownMenu />
            </div>
          </div>
        </div>
        <div className="px-40 flex flex-col gap-6 bg-[#f9f9f9] overflow-y-auto">
          {children}
        </div>
      </div>
    );
  }
);

export default ProductLayout;
