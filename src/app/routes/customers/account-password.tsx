import CustomerLayout from "@/components/layouts/customer-layout";
import AccountPassword from "@/components/shared/account-password";

export default function AccountPasswordRoute() {
  return (
    <CustomerLayout>
      <main className="flex flex-1 flex-col gap-6 py-6 pl-6">
        <AccountPassword />
      </main>
    </CustomerLayout>
  );
}
