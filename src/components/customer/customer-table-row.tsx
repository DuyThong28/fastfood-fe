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
import { useState } from "react";
import image from "@/assets/placeholder.svg";

interface CustomerTableRowProps {
  data: Customer;
  onRefetch: () => Promise<void>;
}

export const CustomerTableRow: React.FC<CustomerTableRowProps> = ({
  data,
  onRefetch,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleActive = async () => {
    try {
      await customerService.enableCustomerById(data.id);
      await onRefetch();
      setIsOpen(false);
    } catch (err) {
      console.log(err);
    }
  };
//   const handleDisable = async () => {
//     try {
//       await customerService.disablecustomerById(data.id);
//       await onRefetch();
//       setIsOpen(false);
//     } catch (err) {
//       console.log(err);
//     }
//   };
  return (
    <TableRow>
      <TableCell className="flex flex-row gap-4 items-center">
        <img
          className="aspect-square rounded-full object-cover"
          src={data.avatar_url || image}
        />
      </TableCell>
      <TableCell>{data.full_name}</TableCell>
      <TableCell>{dateToVNString(new Date(data.birthday))}</TableCell>
      <TableCell>{data.gender === Gender.MALE ? "Nam" : "Nu"}</TableCell>
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
                Kich hoat
              </div>
            ) : (
              <div
                className="py-2 px-3  w-full hover:bg-[#F4F4F5]"
                onClick={handleDisable}
              >
                Khoa
              </div>
            )}
          </PopoverContent>
        </Popover>
      </TableCell>
    </TableRow>
  );
};
