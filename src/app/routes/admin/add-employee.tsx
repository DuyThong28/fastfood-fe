import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "@/config";
import { EmployeeInfoSection } from "@/components/employee/employee-info-section";
import { CreateEmployee, Employee, UpdateEmployee } from "@/types/user";
import { Gender } from "@/common/enums";
import userService from "@/services/user.service";

interface EmployeeNavigate {
  state: {
    data: Employee,
    isUpdate: boolean
  }
}

export default function AddEmployeeRoute() {
  const location = useLocation() as EmployeeNavigate;
  const [detailData, setDetailData] = useState<Employee>({
    id: location.state?.data.id || "",
    email: location.state?.data.email || "",
    gender: location.state?.data.gender || Gender.MALE,
    birthday: location.state?.data.birthday || new Date(),
    phone: location.state?.data.phone || undefined,
    full_name: location.state?.data.full_name || "",
    role: "STAFF",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (location.state?.isUpdate)
      {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...updateData } = detailData;
        const finalUpdateData: UpdateEmployee = {
          id: updateData.id,
          email: updateData.email,
          gender: updateData.gender,
          birthday: updateData.birthday || new Date(),
          phone: updateData.phone,
          fullName: updateData.full_name, 
          role: "STAFF",
        }
        console.log("updateData", updateData);
        await userService.updateStaff(finalUpdateData)
        navigate(routes.ADMIN.EMPLOYEE)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...updateData } = detailData;
        const finalUpdateData: CreateEmployee = {
          email: updateData.email,
          gender: updateData.gender,
          birthday: updateData.birthday || new Date(),
          phone: updateData.phone,
          fullName: updateData.full_name, 
          role: "STAFF",
          password: detailData.password
        }
        await userService.createEmployee(finalUpdateData)
        navigate(routes.ADMIN.EMPLOYEE)
      }
      // navigate(routes.ADMIN.EMPLOYEE);
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
        <EmployeeInfoSection detailData={detailData} onChange={setDetailData} isUpdate={location.state?.isUpdate}/>
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
