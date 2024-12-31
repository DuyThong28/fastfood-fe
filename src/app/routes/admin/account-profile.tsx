import DashBoardLayout from "@/components/layouts/dashboard-layout";
import AccountInfo from "@/components/shared/account-info";

export default function AdminProfileRoute() {
  return (
    <DashBoardLayout>
      <main className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto">
        <h1 className="text-lg font-semibold">Thông Tin Tài Khoản</h1>
        <AccountInfo />
      </main>
    </DashBoardLayout>
  );
}
