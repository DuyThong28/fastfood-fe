import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  FormEvent,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Address, ResAddress } from "@/types/address";
import addressService from "@/services/address.service";
import { toastSuccess } from "@/utils/toast";

export interface AddressDialogRef {
  onOpen: (data?: ResAddress) => void;
  onClose: () => void;
}

interface AddressDialogProps {
  onRefetch: () => Promise<void>;
}

type ErrorState = {
  address?: string;
  fullName?: string;
  phoneNumber?: string;
};

const AddressDialog = forwardRef<AddressDialogRef, AddressDialogProps>(
  function AddressDialog({ onRefetch }, ref) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [address, setAddress] = useState<Address>({
      address: "",
      fullName: "",
      phoneNumber: undefined,
    });
    const [errors, setErrors] = useState<ErrorState>({});

    const validateInputs = () => {
      const newErrors: ErrorState = {};

      if (!address.fullName?.trim()) {
        newErrors.fullName = "Họ và tên không được để trống";
      }
      if (!address.address?.trim()) {
        newErrors.address = "Địa chỉ không được để trống";
      }
      const phoneRegex = /^\d{10}$/;
      if (!address.phoneNumber) {
        newErrors.phoneNumber = "Số điện thoại không được để trống";
      } else if (!phoneRegex.test(address.phoneNumber.toString())) {
        newErrors.phoneNumber = "Số điện thoại chưa đúng định dạng";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(
      ref,
      () => {
        return {
          onOpen(data?: ResAddress) {
            if (data) {
              setAddress({
                address: data.address,
                fullName: data.full_name,
                phoneNumber: data.phone_number,
                id: data.id,
              });
            } else {
              setAddress({
                address: "",
                fullName: "",
                phoneNumber: undefined,
              });
            }
            setErrors({});
            setIsOpen(true);
          },
          onClose() {
            setIsOpen(false);
          },
        };
      },
      []
    );

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateInputs()) return;
      try {
        if (address.id) {
          await addressService.updateAddressById(address);
          toastSuccess("Cập nhật địa chỉ thành công");
          await onRefetch();
       
      } else {
          await addressService.createAddress({
            address: address.address,
            fullName: address.fullName,
            phoneNumber: address.phoneNumber,
          });
          toastSuccess("Thêm mới địa chỉ thành công");
          await onRefetch();
        
      }
      setIsOpen(false);
      setAddress({
        address: "",
        fullName: "",
        phoneNumber: undefined,
      });
      }  catch (err) {
        console.log(err);
      }
    };

    const handleChangeInput = (
      name: string,
      value: string | number | undefined
    ) => {
      setAddress((prevData) => {
        return {
          ...prevData,
          [name]: value,
        };
      });
    };

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {address.id ? "Chỉnh Sửa Địa Chỉ" : "Thêm Địa Chỉ Mới"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-4">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                placeholder="Họ và tên"
                value={address.fullName}
                onChange={(e) => handleChangeInput("fullName", e.target.value)}
              />
              {errors?.fullName && (
                <p className="text-red-500 text-xs">{errors.fullName}</p>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                type="number"
                min={0}
                id="phoneNumber"
                placeholder="Số điện thoại"
                value={address.phoneNumber}
                onChange={(e) =>
                  handleChangeInput("phoneNumber", e.target.value)
                }
              />
              {errors?.phoneNumber && (
                <p className="text-red-500 text-xs">{errors.phoneNumber}</p>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <Label htmlFor="name">Địa chỉ</Label>
              <Input
                id="address"
                placeholder="Địa chỉ"
                value={address.address}
                onChange={(e) => handleChangeInput("address", e.target.value)}
              />
              {errors?.address && (
                <p className="text-red-500 text-xs">{errors.address}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit">Lưu</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

export default AddressDialog;
