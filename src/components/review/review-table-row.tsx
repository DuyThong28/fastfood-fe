import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import image from "@/assets/placeholder.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ReviewTableRow = () => {
  return (
    <TableRow>
      <TableCell>2252</TableCell>
      <TableCell className="font-medium flex flex-row gap-4 items-center">
        <img
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={image}
          width="64"
        />
        Laser Lemonade Machine
      </TableCell>

      <TableCell>5</TableCell>
      <TableCell>San pham tuyet lam</TableCell>
      <TableCell>Le Minh Toan</TableCell>
      <TableCell>13/10/2024</TableCell>
      <TableCell>cam on ban da mua hang</TableCell>

      <TableCell>
        <Badge variant="outline">Draft</Badge>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Chinh sua</DropdownMenuItem>
            <DropdownMenuItem>An</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
