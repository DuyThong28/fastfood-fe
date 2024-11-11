import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
// import { ProductSaleSection } from "@/components/product/product-sale-section";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "@/config";
import { EmployeeInfoSection } from "@/components/employee/employee-info-section";
import { Employee } from "@/types/user";
import { Gender } from "@/common/enums";

export default function AddEmployeeRoute() {
  const [detailData, setDetailData] = useState<Employee>({
    email: "",
    gender: Gender.MALE,
    birthday: new Date(),
    phone: undefined,
    full_name: "",
    avatar_url: undefined,
    role: "EMPLOYEE"
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
    //   await bookService.createBook(detailData);
      navigate(routes.ADMIN.PRODUCT);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashBoardLayout>
      <form
        className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto"
        onSubmit={handleSubmit}
      >
        <EmployeeInfoSection detailData={detailData} onChange={setDetailData} />
        {/* <ProductSaleSection /> */}
        <div className="flex flex-row gap-4 mx-auto mb-12">
          <Button
            variant="outline"
            className="w-40"
            type="button"
            onClick={() => navigate(routes.ADMIN.PRODUCT)}
          >
            Huy
          </Button>
          <Button className="w-40" type="submit">
            Luu
          </Button>
        </div>
      </form>
    </DashBoardLayout>
  );
}
