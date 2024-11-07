import { useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/20/solid";
import { EmblaOptionsType } from "embla-carousel";
import image from "@/assets/placeholder.svg";

const product = {
  name: "Cho Tôi Xin Một Vé Đi Tuổi Thơ (Bìa Mềm) (Tái Bản)",
  price: "68.100d",
  rating: 3.9,
  reviewCount: 117,
  href: "#",
  imageSrc:
    "https://salt.tikicdn.com/cache/750x750/ts/product/8f/63/5d/e17ddc42fbf8bf15b1958222ed1939dc.jpg.webp",
  imageAlt: "Two each of gray, white, and black shirts arranged on table.",

  sizes: [
    { name: "XXS", inStock: true },
    { name: "XS", inStock: true },
    { name: "S", inStock: true },
    { name: "M", inStock: true },
    { name: "L", inStock: true },
    { name: "XL", inStock: true },
    { name: "XXL", inStock: true },
    { name: "XXXL", inStock: false },
  ],
};

import ProductLayout from "@/components/layouts/product-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmblaCarousel from "@/components/shared/embla-carousel";
import { CounterInput } from "@/components/shared/counter-input";
import { ProductVariation } from "@/components/product/product-variation";
import { useParams } from "react-router-dom";
import bookService from "@/services/book.service";
import { ResBookDetail } from "@/types/book";
import cartService from "@/services/cart.service";

const OPTIONS: EmblaOptionsType = {};

export default function BookDetailRoute() {
  const param = useParams();
  const [detailData, setDetailData] = useState<ResBookDetail | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const getBookDetail = async (id: string) => {
    try {
      const response = await bookService.getBookById(id);
      console.log(response)
      setDetailData(response.data.data);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (param?.bookId) {
      getBookDetail(param.bookId);
    }
  }, [param]);

  const handleAddToCart = async () => {
    if (
      detailData?.id &&
      quantity <= detailData.stock_quantity &&
      quantity > 0
    ) {
      try {
        const response = await cartService.addToCart({
          bookId: detailData.id,
          quantity: quantity,
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

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
              <div className="flex items-center ">
                <p className=" text-sm">{detailData.avg_stars}</p>
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={(detailData.avg_stars > rating
                        ? "text-gray-900"
                        : "text-gray-200"
                      ).concat(" h-4 w-4 flex-shrink-0")}
                    />
                  ))}
                </div>
                <p className="ml-3 text-sm">
                  {detailData.total_reviews} danh gia
                </p>
              </div>
            </div>
            <p className="text-xl text-gray-900">{`${detailData.price} d`}</p>
            <section aria-labelledby="options-heading">
              <div className="space-y-6">
                {/* <fieldset
                aria-label="Choose a size"
                className="grid grid-cols-[100px_1fr]"
              >
                <div className="text-gray-900">Phan loai</div>
                <RadioGroup
                  value={selectedSize}
                  onChange={setSelectedSize}
                  className="grid grid-cols-5 gap-4"
                >
                  {product.sizes.map((size, index) => (
                    <ProductVariation key={index} size={size} />
                  ))}
                </RadioGroup>
              </fieldset>
              <fieldset
                aria-label="Choose a size"
                className="grid grid-cols-[100px_1fr]"
              >
                <div className="text-gray-900">Phan loai</div>
                <RadioGroup
                  value={selectedSize}
                  onChange={setSelectedSize}
                  className="grid grid-cols-5 gap-4"
                >
                  {product.sizes.map((size, index) => (
                    <ProductVariation size={size} key={index} />
                  ))}
                </RadioGroup>
              </fieldset> */}
                <fieldset
                  aria-label="Choose a size"
                  className="grid grid-cols-[100px_1fr]"
                >
                  <div className="text-gray-900">So luong</div>
                  <CounterInput
                    max={detailData.stock_quantity}
                    value={quantity}
                    onChange={setQuantity}
                  />
                </fieldset>
                <Button onClick={handleAddToCart} type="button">
                  Them vao gio hang
                </Button>
              </div>
            </section>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mo Ta San Pham</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-justify indent-4">{detailData.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Danh Gia San Pham</CardTitle>
          </CardHeader>
        </Card>
      </ProductLayout>
    )
  );
}
