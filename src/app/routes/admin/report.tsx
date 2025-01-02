import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import DashBoardLayout from "@/components/layouts/dashboard-layout";
import RevenueTab from "./report/revenue-tab";
import ProductTab from "./report/product-tab";

export default function ReportRoute() {
  const [tabState, setTabState] = useState<string>("revenue");

  return (
    <DashBoardLayout>
      <main className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto">
        <h1 className="text-2xl font-bold text-[#A93F15]">Báo cáo</h1>
        <Tabs value={tabState}>
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger
                value="revenue"
                onClick={() => setTabState("revenue")}
              >
                Doanh thu
              </TabsTrigger>
              <TabsTrigger
                value="product"
                onClick={() => setTabState("product")}
              >
                Sản phẩm
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
        <div className="flex flex-row w-full gap-x-10">
          {tabState === "revenue" && <RevenueTab />}
          {tabState === "product" && <ProductTab />}
        </div>
      </main>
    </DashBoardLayout>
  );
}
