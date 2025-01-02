import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Customer } from "@/types/customer";
import { AccountState } from "@/common/enums/customer";
import { Badge } from "../ui/badge";
import { Gender } from "@/common/enums";
import { dateToVNString } from "@/utils/format";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import customerService from "@/services/customer.service";
import { useRef, useState } from "react";
import image from "@/assets/placeholder.svg";
import CustomAlertDialog, {
  CustomAlertDialogRef,
} from "../shared/alert-dialog";
import { toastSuccess } from "@/utils/toast";

interface CustomerTableRowProps {
  data: Customer;
  onRefetch: () => Promise<void>;
}

export const CustomerTableRow: React.FC<CustomerTableRowProps> = ({
  data,
  onRefetch,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const alertDialogRef = useRef<CustomAlertDialogRef | null>(null);

  const handleActive = async () => {
    alertDialogRef.current?.onOpen(
      {
        title: `Bạn có chắc chắn muốn kích hoạt tài khoản này?`,
        description:
          "Sau khi kích hoạt, khách hàng sẽ có thể sử dụng các dịch vụ của hệ thống.",
      },
      async () => {
        try {
          await customerService.enableCustomerById(data.id);
          toastSuccess("Tài khoản này đã được kích hoạt");
          await onRefetch();
          setIsOpen(false);
        } catch (err) {
          console.log(err);
        }
      },
    );
  };

  const handleDisable = async () => {
    alertDialogRef.current?.onOpen(
      {
        title: `Bạn có chắc chắn muốn khóa tài khoản này?`,
        description:
          "Khách hàng sẽ không thể đăng nhập hoặc sử dụng dịch vụ cho đến khi tài khoản được kích hoạt lại.",
      },
      async () => {
        try {
          await customerService.disablecustomerById(data.id);
          toastSuccess("Khóa tài khoản thành công");
          await onRefetch();
          setIsOpen(false);
        } catch (err) {
          console.log(err);
        }
      },
    );
  };

  return (
    <>
      <CustomAlertDialog ref={alertDialogRef} />
      <TableRow>
        <TableCell className="flex flex-row gap-4 items-center">
          <img
            className="aspect-square rounded-full object-cover"
            src={data.avatar_url || image}
          />
        </TableCell>
        <TableCell>{data.full_name}</TableCell>
        <TableCell>{dateToVNString(new Date(data.birthday))}</TableCell>
        <TableCell>{data.gender === Gender.MALE ? "Nam" : "Nữ"}</TableCell>
        <TableCell>{data.phone}</TableCell>
        <TableCell>{data.email}</TableCell>
        <TableCell className="w-40">
          <Badge variant="secondary">
            {data.is_disable ? AccountState.DISABLE : AccountState.ACTIVE}
          </Badge>
        </TableCell>
        <TableCell>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-max p-1">
              {data.is_disable ? (
                <div
                  className="py-2 px-3  w-full hover:bg-[#F4F4F5]"
                  onClick={handleActive}
                >
                  Kích hoạt
                </div>
              ) : (
                <div
                  className="py-2 px-3  w-full hover:bg-[#F4F4F5]"
                  onClick={handleDisable}
                >
                  Khóa tài khoản
                </div>
              )}
            </PopoverContent>
          </Popover>
        </TableCell>
      </TableRow>
    </>
  );
};
