import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Table, TableBody } from "@/components/ui/table";
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
import { ReviewTableHeader } from "@/components/review/review-table-header";
import reviewService from "@/services/review.service";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { ResReviewOfAdmin } from "@/types/review";
import { Meta } from "@/types/api";
import { ReviewTableRow } from "@/components/review/review-table-row";
import { ReviewStatus } from "@/common/enums";
import { REVIEW_sTATUS } from "@/common/constants";
import { dateToString, stringToDate } from "@/utils/format";
import ReplyDialog, { ReplyDialogRef } from "@/components/review/reply-dialog";

export default function ReviewRoute() {
  const [reviews, setReviews] = useState<ResReviewOfAdmin[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 20,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [searchText, setSearchText] = useState<string>("");
  const [rating, setRating] = useState<number[]>([1, 2, 3, 4, 5]);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(true);
  const [date, setDate] = useState<Date | null>(null);
  const [reviewwState, serReviewState] = useState<string>("all");
  const replyDialogRef = useRef<ReplyDialogRef>(null);

  const getAllReviews = async () => {
    try {
      const response = await reviewService.getAllReviews(
        {
          page: meta.page,
          take: meta.take,
        },
        { rating: rating, search: searchText, date: date, state: reviewwState }
      );
      setReviews(response.data.data);
      setMeta(response.data.meta);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllReviews();
  }, []);

  useEffect(() => {
    if (rating.length === 5) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [rating]);

  const handleEnterPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      await getAllReviews();
    }
  };

  const handleCheckRate = (rate: number) => {
    if (rating.includes(rate))
      setRating((prevRate) => prevRate.filter((item) => item !== rate));
    else setRating((prevRate) => prevRate.concat(rate));
  };

  const handleSelectAll = (value: boolean) => {
    setIsAllSelected(value);
    if (value) {
      setRating([1, 2, 3, 4, 5]);
    } else {
      setRating([]);
    }
  };

  return (
    <DashBoardLayout>
      <ReplyDialog ref={replyDialogRef} onRefetch={getAllReviews} />
      <main className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto w-full">
        <h1 className="text-lg font-semibold ">Danh Sach Danh Gia</h1>
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader className="flex flex-col gap-4">
            <div className="flex flex-row gap-6">
              <Label className="font-medium">So sao danh gia</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                />
                <span>Tat ca</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={rating.includes(1)}
                  onCheckedChange={() => handleCheckRate(1)}
                />
                <span>1 Sao</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={rating.includes(2)}
                  onCheckedChange={() => handleCheckRate(2)}
                />{" "}
                <span>2 Sao</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={rating.includes(3)}
                  onCheckedChange={() => handleCheckRate(3)}
                />{" "}
                <span>3 Sao</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={rating.includes(4)}
                  onCheckedChange={() => handleCheckRate(4)}
                />{" "}
                <span>4 Sao</span>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={rating.includes(5)}
                  onCheckedChange={() => handleCheckRate(5)}
                />{" "}
                <span>5 Sao</span>
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Nhap ten san pham"
                  className="w-full rounded-lg bg-background pl-8"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleEnterPress}
                />
              </div>
              <Input
                type="date"
                className="w-fit rounded-lg bg-background pl-8"
                value={date ? dateToString(date) : undefined}
                onChange={(e) =>
                  setDate(e.target.value ? stringToDate(e.target.value) : null)
                }
              />
              <Select
                value={reviewwState}
                onValueChange={(value) => serReviewState(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a statetus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tat ca</SelectItem>
                  <SelectItem value={ReviewStatus.UNREVIEW}>
                    {REVIEW_sTATUS[ReviewStatus.UNREVIEW]}
                  </SelectItem>
                  <SelectItem value={ReviewStatus.REPLIED}>
                    {REVIEW_sTATUS[ReviewStatus.REPLIED]}
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={async () => getAllReviews()}>Ap dung</Button>
            </div>
          </CardHeader>
          <CardContent className="w-full">
            <Table className="overflow-x-auto w-[1600px]">
              <ReviewTableHeader />
              <TableBody>
                {reviews.map((review, index) => (
                  <ReviewTableRow
                    key={index}
                    data={review}
                    onReply={() => replyDialogRef.current?.onOpen(review.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-muted/50">
            <TablePagination data={meta} onChange={setMeta} />
          </CardFooter>
        </Card>
      </main>
    </DashBoardLayout>
  );
}
