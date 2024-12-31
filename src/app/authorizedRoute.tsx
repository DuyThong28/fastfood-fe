import { Navigate } from "react-router-dom";

import { ReactNode } from "react";
import { UserRole } from "@/common/enums";
import { routes } from "@/config";
import { toast } from "react-toastify";

export const AuthorizedAdministrator = function ({
  children,
}: {
  children: ReactNode;
}) {
  const role = localStorage.getItem("role");
  if (role !== UserRole.ADMIN) {
    toast.error("Bạn không có quyền truy cập vào trang này");
    return <Navigate to={routes.AUTH.SIGN_IN} replace={true} />;
  } else if (role === UserRole.ADMIN) return children;
}; // just for admin only

export const AuthorizedStaff = function ({
  children,
}: {
  children: ReactNode;
}) {
  const role = localStorage.getItem("role");
  if (role !== UserRole.ADMIN && role !== UserRole.STAFF) {
    toast.error("Bạn không có quyền truy cập vào trang này");
    return <Navigate to={routes.AUTH.SIGN_IN} replace={true} />;
  } else if (role === UserRole.ADMIN || role === UserRole.STAFF)
    return children;
}; // both admin and staff can access
