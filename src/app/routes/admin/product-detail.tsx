import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import productService from "@/services/product.service";
import { FormEvent, useEffect, useState } from "react";
import { UpdateProductDetail } from "@/types/product";
import { ProductInfoSection } from "@/components/product/product-info-section";
import categoryService from "@/services/category.service";
import { routes } from "@/config";
import { AddProductErrorState } from "./add-product";
import { toastSuccess } from "@/utils/toast";

export default function AdminProductDetailRoute() {
  const param = useParams();
  const [detailData, setDetailData] = useState<UpdateProductDetail>({
    title: "",
    author: "NXBVN",
    price: 0,
    description: "",
    image_url: [],
    id: "",
    categoryId: "",
    images: [],
    initCategory: null,
  });
  const [errors, setErrors] = useState<AddProductErrorState>({});
  const navigate = useNavigate();

  const getProductDetail = async (id: string) => {
    try {
      const productResponse = await productService.getProductById(id);
      const productData = productResponse.data.data;
      const categoryResponse = await categoryService.getCategoryById(
        productData.category_id
      );

      setDetailData({
        title: productData.title,
        author: productData.author,
        price: +productData.price,
        description: productData.description,
        image_url: productData.image_url,
        id: productData.id,
        categoryId: productData.category_id,
        images: [],
        initCategory: categoryResponse.data.data,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const validateInputs = () => {
    const newErrors: AddProductErrorState = {};

    if (!detailData.title.trim()) {
      newErrors.title = "Tên sản phẩm không được để trống";
    }

    if (!detailData.categoryId.trim()) {
      newErrors.categoryId = "Danh mục không được để trống";
    }

    if (detailData.price <= 0) {
      newErrors.price = "Giá bán phải lớn hơn 0";
    }

    if (!detailData.description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    }

    if (detailData.images.length + detailData.image_url.length < 1) {
      newErrors.images = "Hình ảnh không được để trống";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateInputs()) return;
    try {
      await productService.updateProductById(detailData);
      toastSuccess("Cập nhật sản phẩm thành công");
      navigate(routes.ADMIN.PRODUCT);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (param?.productId) {
      getProductDetail(param.productId);
    }
  }, [param]);

  return (
    <DashBoardLayout>
      <form
        className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto"
        onSubmit={handleSubmit}
        noValidate
      >
        <ProductInfoSection
          detailData={detailData}
          onChange={setDetailData}
          errors={errors}
        />
        <div className="flex flex-row gap-4 mx-auto mb-12">
          <Button
            variant="outline"
            className="w-40 text-[#A93F15] hover:text-[#A93F15]"
            type="button"
            onClick={() => navigate(routes.ADMIN.PRODUCT)}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            className=" w-40 rounded-sm bg-[#A93F15] hover:bg-[#FF7E00]"
          >
            Lưu
          </Button>
        </div>
      </form>
    </DashBoardLayout>
  );
}
