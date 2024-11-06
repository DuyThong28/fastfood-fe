import {
    DropdownMenu,
    DropdownMenuTrigger,
  } from "@radix-ui/react-dropdown-menu";
  import { Button } from "../ui/button";
  import { CircleUser } from "lucide-react";
  import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
  } from "../ui/dropdown-menu";
  import { useNavigate } from "react-router-dom";
  import { routes } from "@/config";
  import useAuth from "@/hooks/useAuth";
  import { UserRole } from "@/common/enums";
  import authService from "@/services/auth.service";
  import { removeAccessToken } from "@/lib/api-client";
  
  export default function UserDropDownMenu() {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
  
    const handleLogOut = async () => {
      try {
        const response = await authService.logOut();
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
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
  
        <DropdownMenuContent align="end">
          {auth && auth.role === UserRole.ADMIN && (
            <DropdownMenuItem
              onClick={() => navigate(routes.ADMIN.ACCOUNT_PROFILE)}
            >
              Tai khoan cua toi
            </DropdownMenuItem>
          )}
          {auth && auth.role === UserRole.CUSTOMER && (
            <>
              <DropdownMenuItem
                onClick={() => navigate(routes.CUSTOMER.ACCOUNT_PROFILE)}
              >
                Tai khoan cua toi
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(routes.CUSTOMER.PURCHASE)}
              >
                Don mua
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogOut}>Dang xuat</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  