import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useMemo } from "react";
import { routes } from "@/config";
import CustomerRoute from "./routes/admin/customer";
import NotFoundRoute from "./routes/not-found";
import ReviewRoute from "./routes/admin/review";
import AdminPasswordRoute from "./routes/admin/account-password";
import ProductRoute from "./routes/admin/product";
import OrderRoute from "./routes/admin/order";
import DashboardRoute from "./routes/admin/dashboard";
import AddProductRoute from "./routes/admin/add-product";
import AdminProfileRoute from "./routes/admin/account-profile";
import PurchaseRoute from "./routes/customers/purchase";
import OrderDetailRoute from "./routes/customers/order-detail";
import CheckOutRoute from "./routes/customers/checkout";
import AccountPasswordRoute from "./routes/customers/account-password";
import CartRoute from "./routes/customers/cart";
import AccountProfileRoute from "./routes/customers/account-profile";
import AccountAddressRoute from "./routes/customers/account-address";
import HomeRoute from "./routes/customers/home";
import VerificationFailed from "./routes/auth/verification/verification_failed";
import VerificationSuccess from "./routes/auth/verification/verification_success";
import VerificationRoute from "./routes/auth/verification/verification";
import ResetPasswordRoute from "./routes/auth/reset-password";
import ForgotPasswordRoute from "./routes/auth/forgot-password";
import SignUpRoute from "./routes/auth/sign-up";
import SignInRoute from "./routes/auth/sign-in";
import CategoryRoute from "./routes/admin/category";
import AdminOrderDetailRoute from "./routes/admin/order-detail";
import SignInSuccess from "./routes/auth/sign-in-success";
import AddEmployeeRoute from "./routes/admin/add-employee";
import EmployeeRoute from "./routes/admin/employee";
import PublicProductDetailRoute from "./routes/customers/product-detail";
import AdminProductDetailRoute from "./routes/admin/product-detail";
import {
  AuthorizedAdministrator,
  AuthorizedCustomer,
  AuthorizedStaff,
  UnauthorizedUser,
} from "./authorizedRoute";
import ReportRoute from "./routes/admin/report";
import Chatbot from "@/components/chatbot/chatbot";

const createAppRouter = () =>
  createBrowserRouter([
    {
      path: routes.AUTH.SIGN_IN,
      element: (
        <UnauthorizedUser>
          <SignInRoute />
        </UnauthorizedUser>
      ),
    },
    {
      path: routes.AUTH.SIGN_UP,
      element: (
        <UnauthorizedUser>
          <SignUpRoute />
        </UnauthorizedUser>
      ),
    },
    {
      path: routes.AUTH.FORGOT_PASSWORD,
      element: (
        <UnauthorizedUser>
          <ForgotPasswordRoute />
        </UnauthorizedUser>
      ),
    },
    {
      path: routes.AUTH.RESET_PASSWORD,
      element: (
        <UnauthorizedUser>
          <ResetPasswordRoute />
        </UnauthorizedUser>
      ),
    },
    {
      path: routes.AUTH.VERIFICATION,
      element: <VerificationRoute />,
    },
    {
      path: routes.AUTH.VERIFICATION_SUCCESS,
      element: <VerificationSuccess />,
    },
    {
      path: routes.AUTH.VERIFICATION_FAILED,
      element: <VerificationFailed />,
    },
    {
      path: routes.AUTH.SIGN_IN_SUCCESS,
      element: <SignInSuccess />,
    },
    {
      path: routes.CUSTOMER.HOME,
      element: (
        <>
          <HomeRoute />
          <Chatbot />
        </>
      ),
    },
    {
      path: routes.CUSTOMER.ACCOUNT_ADDRESS,
      element: (
        <AuthorizedCustomer>
          <AccountAddressRoute />
          <Chatbot />
        </AuthorizedCustomer>
      ),
    },
    {
      path: routes.CUSTOMER.ACCOUNT_PROFILE,
      element: (
        <AuthorizedCustomer>
          <AccountProfileRoute />
          <Chatbot />
        </AuthorizedCustomer>
      ),
    },
    {
      path: routes.CUSTOMER.PRODUCT_DETAIL,
      element: (
        <>
          <PublicProductDetailRoute />
          <Chatbot />
        </>
      ),
    },
    {
      path: routes.CUSTOMER.CART,
      element: (
        <AuthorizedCustomer>
          <CartRoute />
          <Chatbot />
        </AuthorizedCustomer>
      ),
    },
    {
      path: routes.CUSTOMER.CHANGE_PASSWORD,
      element: (
        <AuthorizedCustomer>
          <AccountPasswordRoute />
          <Chatbot />
        </AuthorizedCustomer>
      ),
    },
    {
      path: routes.CUSTOMER.CHECKOUT,
      element: (
        <AuthorizedCustomer>
          <CheckOutRoute />
          <Chatbot />
        </AuthorizedCustomer>
      ),
    },
    {
      path: routes.CUSTOMER.ORDER_DETAIL,
      element: (
        <AuthorizedCustomer>
          <OrderDetailRoute />
          <Chatbot />
        </AuthorizedCustomer>
      ),
    },
    {
      path: routes.CUSTOMER.PURCHASE,
      element: (
        <AuthorizedCustomer>
          <PurchaseRoute />
          <Chatbot />
        </AuthorizedCustomer>
      ),
    },
    {
      path: routes.ADMIN.ACCOUNT_PROFILE,
      element: (
        <AuthorizedStaff>
          <AdminProfileRoute />
        </AuthorizedStaff>
      ),
    },
    {
      path: routes.ADMIN.ADD_PRODUCT,
      element: (
        <AuthorizedAdministrator>
          <AddProductRoute />
        </AuthorizedAdministrator>
      ),
    },
    {
      path: routes.ADMIN.REPORT,
      element: (
        <AuthorizedStaff>
          <ReportRoute />
        </AuthorizedStaff>
      ),
    },

    {
      path: routes.ADMIN.DASHBOAD,
      element: (
        <AuthorizedStaff>
          <DashboardRoute />
        </AuthorizedStaff>
      ),
    },
    {
      path: routes.ADMIN.ORDER,
      element: (
        <AuthorizedStaff>
          <OrderRoute />
        </AuthorizedStaff>
      ),
    },
    {
      path: routes.ADMIN.ORDER_DETAIL,
      element: (
        <AuthorizedStaff>
          <AdminOrderDetailRoute />
        </AuthorizedStaff>
      ),
    },
    {
      path: routes.ADMIN.PRODUCT,
      element: (
        <AuthorizedAdministrator>
          <ProductRoute />
        </AuthorizedAdministrator>
      ),
    },
    {
      path: routes.ADMIN.CATEGORY,
      element: (
        <AuthorizedAdministrator>
          <CategoryRoute />
        </AuthorizedAdministrator>
      ),
    },
    {
      path: routes.ADMIN.CHANGE_PASSWORD,
      element: (
        <AuthorizedStaff>
          <AdminPasswordRoute />
        </AuthorizedStaff>
      ),
    },
    {
      path: routes.ADMIN.PRODUCT_DETAIL,
      element: (
        <AuthorizedAdministrator>
          <AdminProductDetailRoute />
        </AuthorizedAdministrator>
      ),
    },
    {
      path: routes.ADMIN.REVIEW,
      element: (
        <AuthorizedAdministrator>
          <ReviewRoute />
        </AuthorizedAdministrator>
      ),
    },
    {
      path: routes.ADMIN.CUSTOMER,
      element: (
        <AuthorizedStaff>
          <CustomerRoute />
        </AuthorizedStaff>
      ),
    },
    {
      path: routes.ADMIN.EMPLOYEE,
      element: (
        <AuthorizedAdministrator>
          <EmployeeRoute />
        </AuthorizedAdministrator>
      ),
    },
    {
      path: routes.ADMIN.ADD_EMPLOYEE,
      element: (
        <AuthorizedAdministrator>
          <AddEmployeeRoute />
        </AuthorizedAdministrator>
      ),
    },
    {
      path: "*",
      element: <NotFoundRoute />,
    },
  ]);

export default function AppRouter() {
  const router = useMemo(() => createAppRouter(), []);
  return <RouterProvider router={router} />;
}
