import CustomerLayout from "@/components/layouts/customer-layout";
import AccountInfo from "@/components/shared/account-info";

export default function AccountProfileRoute() {
  return (
    <CustomerLayout>
      <main className="flex flex-1 flex-col gap-6 py-6 pl-6">
        <h1 className="text-lg font-semibold text-[#A93F15]">
          Thông Tin Tài Khoản
        </h1>
        <AccountInfo />
      </main>
    </CustomerLayout>
  );
}
