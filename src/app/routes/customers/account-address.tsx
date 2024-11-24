import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CustomerLayout from "@/components/layouts/customer-layout";
import { CustomerAddress } from "@/components/customer/customer-address";
import AddressDialog, {
  AddressDialogRef,
} from "@/components/customer/address-dialog";
import { useEffect, useRef, useState } from "react";
import addressService from "@/services/address.service";
import { ResAddress } from "@/types/address";

export default function AccountAddressRoute() {
  const dialogRef = useRef<AddressDialogRef>(null);
  const [addresses, setAddresses] = useState<ResAddress[]>([]);
  const handleAddNew = () => {
    dialogRef.current?.onOpen();
  };

  const getAllAddress = async () => {
    try {
      const response = await addressService.getAllAddressByUser();
      setAddresses(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllAddress();
  }, []);

  return (
    <CustomerLayout>
      <AddressDialog ref={dialogRef} onRefetch={getAllAddress} />
      <main className="flex flex-1 flex-col gap-6 py-6 pl-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Địa Chỉ Của Tôi</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button className="gap-1" onClick={handleAddNew}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Thêm mới địa chỉ
              </span>
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {addresses.map((address, index) => {
            return (
              <CustomerAddress
                key={index}
                data={address}
                onRefetch={getAllAddress}
                onUpdate={() => dialogRef.current?.onOpen(address)}
              />
            );
          })}
        </div>
      </main>
    </CustomerLayout>
  );
}
