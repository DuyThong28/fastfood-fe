import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ProductSaleSection = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Thong Tin Ban Hang</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-[120px_1fr] gap-4">
          <Label className="text-right">phan loai hang</Label>
          <div className="w-full space-y-6">
            <div className="w-full p-6 bg-gray-100 rounded-md space-y-4">
              <div className="flex items-center">
                <Input
                  id="name"
                  type="name"
                  value="So trang"
                  required
                  className="w-1/2 bg-white"
                />
                <X className="w-5 h-5 text-black ml-auto" />
              </div>
              <Separator />
              <div className="grid grid-cols-2 w-full gap-6">
                <div className="flex items-center gap-4">
                  <Input
                    id="name"
                    type="name"
                    placeholder="Ten san pham"
                    required
                    className="bg-white"
                  />
                  <Trash2 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    id="name"
                    type="name"
                    placeholder="Ten san pham"
                    required
                    className="bg-white"
                  />
                  <Trash2 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    id="name"
                    type="name"
                    placeholder="Ten san pham"
                    required
                    className="bg-white"
                  />
                  <Trash2 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    id="name"
                    type="name"
                    placeholder="Ten san pham"
                    required
                    className="bg-white"
                  />
                  <Trash2 className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="w-full p-6 bg-gray-100 rounded-md space-y-4">
              <div className="flex items-center">
                <Input
                  id="name"
                  type="name"
                  value="So trang"
                  required
                  className="w-1/2 bg-white"
                />
                <X className="w-5 h-5 text-black ml-auto" />
              </div>
              <Separator />
              <div className="grid grid-cols-2 w-full gap-6">
                <div className="flex items-center gap-4">
                  <Input
                    id="name"
                    type="name"
                    placeholder="Ten san pham"
                    required
                    className="bg-white"
                  />
                  <Trash2 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    id="name"
                    type="name"
                    placeholder="Ten san pham"
                    required
                    className="bg-white"
                  />
                  <Trash2 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    id="name"
                    type="name"
                    placeholder="Ten san pham"
                    required
                    className="bg-white"
                  />
                  <Trash2 className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-center gap-4">
                  <Input
                    id="name"
                    type="name"
                    placeholder="Ten san pham"
                    required
                    className="bg-white"
                  />
                  <Trash2 className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[120px_1fr]  gap-4">
          <Label className="text-right">Danh sach phan loai hang</Label>
          <div className="w-full border border-gray-300 rounded-md overflow-hidden">
            <Table className="border-collapse table-fixed">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>So trang</TableHead>
                  <TableHead>So trang</TableHead>
                  <TableHead>Gia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>200</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell className="bg-gray-50">
                    <Input className="bg-white" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>200</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell className="bg-gray-50">
                    <Input className="bg-white" />
                  </TableCell>
                </TableRow>{" "}
                <TableRow>
                  <TableCell>200</TableCell>
                  <TableCell>200</TableCell>
                  <TableCell className="bg-gray-50">
                    <Input className="bg-white" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
