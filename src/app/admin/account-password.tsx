import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function AdminPasswordRoute() {
  return (
    <DashBoardLayout>
      <main className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto">
        <div className="justify-center mt-14 flex">
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Doi Mat Khau</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Mat khau hien tai</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mat khau moi</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Nhap lai mat khau moi</Label>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Xac Nhan</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </DashBoardLayout>
  );
}
