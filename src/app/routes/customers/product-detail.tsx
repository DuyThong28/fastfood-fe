import { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { EmblaOptionsType } from "embla-carousel";
import image from "@/assets/placeholder.svg";

import ProductLayout from "@/components/layouts/product-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmblaCarousel from "@/components/shared/embla-carousel";
import { CounterInput } from "@/components/shared/counter-input";
import { useParams } from "react-router-dom";
import productService from "@/services/product.service";
import { ResProductDetail } from "@/types/product";
import cartService from "@/services/cart.service";
import reviewService from "@/services/review.service";
import { Meta } from "@/types/api";
import { ResReview } from "@/types/review";
import { TablePagination } from "@/components/shared/table-pagination";
import { ReviewItem } from "@/components/product/review-item";
import { StarButton } from "@/components/product/star-button";
import { formatNumber } from "@/utils/format";
import { toastSuccess } from "@/utils/toast";

const OPTIONS: EmblaOptionsType = {};

export default function ProductDetailRoute() {
  const param = useParams();
  const [detailData, setDetailData] = useState<ResProductDetail | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [reviews, setReviews] = useState<ResReview[]>([]);
  const [rating, setRating] = useState<number[]>([1, 2, 3, 4, 5]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 20,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [isAllSelected, setIsAllSelected] = useState<boolean>(true);

  const getProductDetail = async (id: string) => {
    try {
      const response = await productService.getProductById(id);
      console.log(response);
      setDetailData(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getReviewByProductId = async (id: string) => {
    try {
      const response = await reviewService.getReivewsByProductId(
        {
          page: meta.page,
          take: meta.take,
        },
        id,
        { rating }
      );

      setMeta(response.data.meta);
      setReviews(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (param?.productId) {
      getProductDetail(param.productId);
      getReviewByProductId(param.productId);
    }
  }, [param, rating]);

  const handleAddToCart = async () => {
    if (
      detailData?.id &&
      /* quantity <= detailData.stock_quantity && */
      quantity > 0
    ) {
      try {
        await cartService.addToCart({
          productId: detailData.id,
          quantity: quantity,
        });
        toastSuccess("Thêm vào giỏ hàng thành công");
      } catch (err) {
        console.log(err);
      }
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

  useEffect(() => {
    if (rating.length === 5) {
      setIsAllSelected(true);
    } else {
      setIsAllSelected(false);
    }
  }, [rating]);

  return (
    detailData && (
      <ProductLayout>
        <Card className="mt-6 grid grid-cols-5 gap-12 p-6">
          <div className="w-full col-span-2">
            <EmblaCarousel
              slides={
                detailData?.image_url && detailData?.image_url.length > 0
                  ? detailData?.image_url
                  : [image]
              }
              options={OPTIONS}
            />
          </div>
          <div className="space-y-6  col-span-3">
            <h2 className="text-xl font-medium text-gray-900 ">
              {detailData.title}
            </h2>

            <div>
              <div className="flex items-center">
                <p className="text-sm mr-1">{detailData.avg_stars}</p>
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={(detailData.avg_stars > rating
                        ? "text-[#A93F15]"
                        : "text-gray-200"
                      ).concat(" h-4 w-4 flex-shrink-0")}
                    />
                  ))}
                </div>
                <p className="ml-3 text-sm">
                  {`${detailData.total_reviews} đánh giá`}
                </p>
              </div>
            </div>
            <p className="text-xl text-gray-900">{`${formatNumber(
              detailData.price
            )} đ`}</p>
            <section aria-labelledby="options-heading">
              <div className="space-y-6">
                <fieldset
                  aria-label="Choose a size"
                  className="grid grid-cols-[100px_1fr]"
                >
                  <div className="text-gray-900">Số lượng</div>
                  <CounterInput value={quantity} onChange={setQuantity} />
                </fieldset>
                <Button
                  onClick={handleAddToCart}
                  type="button"
                  className="bg-[#A93F15] hover:bg-[#FF7E00]"
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
            </section>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-[#A93F15]">Mô Tả Sản Phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-justify indent-4">{detailData.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-[#A93F15]">Đánh Giá Sản Phẩm</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="border border-[#A93F15] rounded-md p-6 w-full flex flex-row gap-10 items-start bg-[#FFFBF7]">
              <div>
                <div className="mb-2">
                  <span className=" text-[30px] text-[#A93F15]">
                    {detailData.avg_stars}
                  </span>
                  <span className="text-[20px] text-[#A93F15]"> trên 5</span>
                </div>
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={(detailData.avg_stars > rating
                        ? "text-[#A93F15]"
                        : "text-gray-200"
                      ).concat(" h-5 w-5 flex-shrink-0")}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <StarButton
                  onClick={() => handleSelectAll(!isAllSelected)}
                  value={"Tất cả"}
                  isActive={isAllSelected}
                />
                <StarButton
                  onClick={() => handleCheckRate(5)}
                  value={"5 sao"}
                  isActive={rating.includes(5)}
                />
                <StarButton
                  onClick={() => handleCheckRate(4)}
                  isActive={rating.includes(4)}
                  value={"4 sao"}
                />
                <StarButton
                  onClick={() => handleCheckRate(3)}
                  isActive={rating.includes(3)}
                  value={"3 sao"}
                />
                <StarButton
                  onClick={() => handleCheckRate(2)}
                  isActive={rating.includes(2)}
                  value={"2 sao"}
                />
                <StarButton
                  onClick={() => handleCheckRate(1)}
                  isActive={rating.includes(1)}
                  value={"1 sao"}
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              {reviews.map((review, index) => {
                return <ReviewItem data={review} key={index} />;
              })}
            </div>
            <TablePagination data={meta} onChange={setMeta} />
          </CardContent>
        </Card>
      </ProductLayout>
    )
  );
}
