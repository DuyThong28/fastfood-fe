import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { ProductInfoSection } from "@/components/product/product-info-section";
import { ProductSaleSection } from "@/components/product/product-sale-section";
import { FormEvent, useState } from "react";
import { CreateProductDetail } from "@/types/product";
import productService from "@/services/product.service";
import { useNavigate } from "react-router-dom";
import { routes } from "@/config";
import { toastSuccess } from "@/utils/toast";

export type AddProductErrorState = {
  title?: string;
  categoryId?: string;
  entryPrice?: string;
  price?: string;
  stockQuantity?: string;
  description?: string;
  images?: string;
};

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
  const [errors, setErrors] = useState<AddProductErrorState>({});

  const validateInputs = () => {
    const newErrors: AddProductErrorState = {};

    if (!detailData.title.trim()) {
      newErrors.title = "Tên sản phẩm không được để trống";
    }

    if (!detailData.categoryId.trim()) {
      newErrors.categoryId = "Danh mục không được để trống";
    }

    if (detailData.entryPrice <= 0) {
      newErrors.entryPrice = "Giá nhập phải lớn hơn 0";
    }

    if (detailData.price <= 0) {
      newErrors.price = "Giá bán phải lớn hơn 0";
    }

    if (detailData.price < detailData.entryPrice) {
      newErrors.price = "Giá bán không được nhỏ hơn giá nhập";
    }

    if (detailData.stockQuantity < 0) {
      newErrors.stockQuantity = "Số lượng tồn kho không được nhỏ hơn 0";
    }

    if (!detailData.description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    }

    if (!detailData.images || detailData.images.length === 0) {
      newErrors.images = "Hình ảnh không được để trống";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;
    try {
      await productService.createProduct(detailData);
      toastSuccess("Thêm sản phẩm thành công")
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
        noValidate
      >
        <ProductInfoSection detailData={detailData} onChange={setDetailData} errors={errors}/>
        {/* <ProductSaleSection /> */}
        <div className="flex flex-row gap-4 mx-auto mb-12">
          <Button
            variant="outline"
            className="w-40"
            type="button"
            onClick={() => navigate(routes.ADMIN.PRODUCT)}
          >
            Hủy
          </Button>
          <Button className="w-40" type="submit">
            Lưu
          </Button>
        </div>
      </form>
    </DashBoardLayout>
  );
}
