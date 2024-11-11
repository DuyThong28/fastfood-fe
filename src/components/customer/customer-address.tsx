import { Button } from "@/components/ui/button";
import SectionCard from "../shared/section-card";
import { ResAddress } from "@/types/address";
import React from "react";
import addressService from "@/services/address.service";

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
  const handleDeleteAddress = async () => {
    try {
      await addressService.deleteAddressById(data.id);
      await onRefetch();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <SectionCard className="flex flex-row justify-between  p-4">
      <div className="flex flex-col gap-1">
        <div>{data.full_name}</div>
        <div className="text-sm">
          <span className="text-[#787C80]">Dia chi: </span>
          {data.address}
        </div>
        <div className="text-sm">
          <span className="text-[#787C80]">Dien thoai: </span>
          {data.phone_number}
        </div>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <Button variant="secondary" onClick={onUpdate}>
          Chinh sua
        </Button>
        <Button variant="outline" onClick={handleDeleteAddress}>
          Xoa
        </Button>
      </div>
    </SectionCard>
  );
};
