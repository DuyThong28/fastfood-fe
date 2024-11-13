import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { ProductInfoSection } from "@/components/product/product-info-section";
import { ProductSaleSection } from "@/components/product/product-sale-section";
import { FormEvent, useState } from "react";
import { CreateProductDetail } from "@/types/product";
import productService from "@/services/product.service";
import { useNavigate } from "react-router-dom";
import { routes } from "@/config";

export default function AddProductRoute() {
  const [detailData, setDetailData] = useState<CreateProductDetail>({
    title: "",
    author: "NXBVN",
    categoryId: "",
    entryPrice: 0,
    price: 0,
    stockQuantity: 0,
    description: "",
    images: [],
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await productService.createProduct(detailData);
      navigate(routes.ADMIN.PRODUCT);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashBoardLayout>
      <form
        className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto"
        onSubmit={handleSubmit}
      >
        <ProductInfoSection detailData={detailData} onChange={setDetailData} />
        {/* <ProductSaleSection /> */}
        <div className="flex flex-row gap-4 mx-auto mb-12">
          <Button
            variant="outline"
            className="w-40"
            type="button"
            onClick={() => navigate(routes.ADMIN.PRODUCT)}
          >
            Huy
          </Button>
          <Button className="w-40" type="submit">
            Luu
          </Button>
        </div>
      </form>
    </DashBoardLayout>
  );
}
