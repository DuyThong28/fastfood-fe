import DashBoardLayout from "@/components/layouts/dashboard-layout";
import AccountPassword from "@/components/shared/account-password";

export default function AdminPasswordRoute() {
  return (
    <DashBoardLayout>
      <main className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto">
        <AccountPassword />
      </main>
    </DashBoardLayout>
  );
}
