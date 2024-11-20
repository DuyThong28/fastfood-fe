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
import ProductDetailRoute from "./routes/customers/product-detail";
import PublicProductDetailRoute from "./routes/customers/product-detail";
import AdminProductDetailRoute from "./routes/admin/product-detail";
import ReportRoute from "./routes/admin/report";

const createAppRouter = () =>
  createBrowserRouter([
    {
      path: routes.AUTH.SIGN_IN,
      element: <SignInRoute />,
    },
    {
      path: routes.AUTH.SIGN_UP,
      element: <SignUpRoute />,
    },
    {
      path: routes.AUTH.FORGOT_PASSWORD,
      element: <ForgotPasswordRoute />,
    },
    {
      path: routes.AUTH.RESET_PASSWORD,
      element: <ResetPasswordRoute />,
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
      element: <HomeRoute />,
    },
    {
      path: routes.CUSTOMER.ACCOUNT_ADDRESS,
      element: <AccountAddressRoute />,
    },
    {
      path: routes.CUSTOMER.ACCOUNT_PROFILE,
      element: <AccountProfileRoute />,
    },
    {
      path: routes.CUSTOMER.PRODUCT_DETAIL,
      element: <PublicProductDetailRoute />,
    },
    {
      path: routes.CUSTOMER.CART,
      element: <CartRoute />,
    },
    {
      path: routes.CUSTOMER.CHANGE_PASSWORD,
      element: <AccountPasswordRoute />,
    },
    {
      path: routes.CUSTOMER.CHECKOUT,
      element: <CheckOutRoute />,
    },
    {
      path: routes.CUSTOMER.ORDER_DETAIL,
      element: <OrderDetailRoute />,
    },
    {
      path: routes.CUSTOMER.PURCHASE,
      element: <PurchaseRoute />,
    },
    {
      path: routes.ADMIN.ACCOUNT_PROFILE,
      element: <AdminProfileRoute />,
    },
    {
      path: routes.ADMIN.ADD_PRODUCT,
      element: <AddProductRoute />,
    },
    {
      path: routes.ADMIN.REPORT,
      element: <ReportRoute />,
    },

    {
      path: routes.ADMIN.DASHBOAD,
      element: <DashboardRoute />,
    },
    {
      path: routes.ADMIN.ORDER,
      element: <OrderRoute />,
    },
    {
      path: routes.ADMIN.ORDER_DETAIL,
      element: <AdminOrderDetailRoute />,
    },
    {
      path: routes.ADMIN.PRODUCT,
      element: <ProductRoute />,
    },
    {
      path: routes.ADMIN.CATEGORY,
      element: <CategoryRoute />,
    },
    {
      path: routes.ADMIN.CHANGE_PASSWORD,
      element: <AdminPasswordRoute />,
    },
    {
      path: routes.ADMIN.PRODUCT_DETAIL,
      element: <AdminProductDetailRoute />,
    },
    {
      path: routes.ADMIN.REVIEW,
      element: <ReviewRoute />,
    },
    {
      path: routes.ADMIN.CUSTOMER,
      element: <CustomerRoute />,
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
