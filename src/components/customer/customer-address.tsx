import { Button } from "@/components/ui/button";
import SectionCard from "../shared/section-card";
import { ResAddress } from "@/types/address";
import React, { useRef } from "react";
import addressService from "@/services/address.service";
import CustomAlertDialog, {
  CustomAlertDialogRef,
} from "../shared/alert-dialog";

interface CustomerAddressProps {
  data: ResAddress;
  onRefetch: () => Promise<void>;
  onUpdate: () => void;
}

export const CustomerAddress: React.FC<CustomerAddressProps> = ({
  data,
  onRefetch,
  onUpdate,
}) => {
  const alertDialogRef = useRef<CustomAlertDialogRef | null>(null);
  const handleDeleteAddress = async () => {
    alertDialogRef.current?.onOpen(
      {
        title: `Bạn có chắc chắn muốn xóa địa chỉ?`,
        description: "Bạn có thể thêm lại địa chỉ mới nếu muốn sau này.",
      },
      async () => {
        try {
          await addressService.deleteAddressById(data.id);
          await onRefetch();
        } catch (err) {
          console.log(err);
        }
      }
    );
  };
  return (
    <>
      <CustomAlertDialog ref={alertDialogRef} />
      <SectionCard className="flex flex-row justify-between  p-4">
        <div className="flex flex-col gap-1">
          <div>
            {" "}
            <span className="text-[#787C80]">Họ và tên: </span>
            {data.full_name}
          </div>
          <div className="text-sm">
            <span className="text-[#787C80]">Địa chỉ: </span>
            {data.address}
          </div>
          <div className="text-sm">
            <span className="text-[#787C80]">Điện thoại: </span>
            {data.phone_number}
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center">
          <Button
            variant="secondary"
            onClick={onUpdate}
            className="text-white bg-[#A93F15] hover:bg-[#FF7E00]"
          >
            Chỉnh sửa
          </Button>
          <Button
            variant="outline"
            className="text-[#A93F15] hover:text-[#A93F15]"
            onClick={handleDeleteAddress}
          >
            Xóa
          </Button>
        </div>
      </SectionCard>
    </>
  );
};
