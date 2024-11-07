import CustomerLayout from "@/components/layouts/customer-layout";
import AccountPassword from "@/components/shared/account-password";

export default function AccountPasswordRoute() {
  return (
    <CustomerLayout>
      <main className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto">
        <div className="justify-center mt-14 flex">
          <AccountPassword />
        </div>
      </main>
    </CustomerLayout>
  );
}
