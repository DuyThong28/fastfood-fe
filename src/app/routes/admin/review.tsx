import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Table } from "@/components/ui/table";
import { Search } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

import DashBoardLayout from "@/components/layouts/dashboard-layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { TablePagination } from "@/components/shared/table-pagination";
import { ReviewTableBody } from "@/components/review/review-table-body";
import { ReviewTableHeader } from "@/components/review/review-table-header";

export default function ReviewRoute() {
 
  
  return (
    <DashBoardLayout>
      <main className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto">
        <h1 className="text-lg font-semibold ">Danh Sach Danh Gia</h1>
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader className="flex flex-col gap-4">
            <div className="flex flex-row gap-6">
              <Label className="font-medium">So sao danh gia</Label>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <span>Tat ca</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <span>1 Sao</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" /> <span>2 Sao</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" /> <span>3 Sao</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" /> <span>4 Sao</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" /> <span>5 Sao</span>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Nhap ten san pham"
                  className="w-full rounded-lg bg-background pl-8"
                />
              </div>
              <Input
                type="date"
                className="w-fit rounded-lg bg-background pl-8"
              />
              <Select defaultValue="all">
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select a statetus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tat ca</SelectItem>
                  <SelectItem value="to-reply">Can phan hoi</SelectItem>
                  <SelectItem value="reply">Da tra loi</SelectItem>
                </SelectContent>
              </Select>
              <Button>Ap dung</Button>
              <Button variant="outline" className="border border-black">
                Nhap lai
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <ReviewTableHeader />
              <ReviewTableBody />
            </Table>
          </CardContent>
          <CardFooter className="bg-muted/50">
            <TablePagination />
          </CardFooter>
        </Card>
      </main>
    </DashBoardLayout>
  );
}
