import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import productService from "@/services/product.service";
import { FormEvent, useEffect, useState } from "react";
import { UpdateProductDetail } from "@/types/product";
import { ProductInfoSection } from "@/components/product/product-info-section";
import categoryService from "@/services/category.service";
import { routes } from "@/config";
// import { ProductInfoSection } from "@/components/product/product-info-section";

export default function ProductDetailRoute() {
  const param = useParams();
  const [detailData, setDetailData] = useState<UpdateProductDetail>({
    title: "",
    author: "NXBVN",
    price: 0,
    description: "",
    image_url: [],
    id: "",
    entryPrice: 0,
    stockQuantity: 0,
    categoryId: "",
    images: [],
    initCategory: null,
  });

  const navigate = useNavigate();

  const getProductDetail = async (id: string) => {
    try {
      const productResponse = await productService.getProductById(id);
      const productData = productResponse.data.data;
      const categoryResponse = await categoryService.getCategoryById(
        productData.category_id,
      );

      setDetailData({
        title: productData.title,
        author: productData.author,
        price: productData.price,
        description: productData.description,
        image_url: productData.image_url,
        id: productData.id,
        entryPrice: productData.entry_price,
        stockQuantity: productData.stock_quantity,
        categoryId: productData.category_id,
        images: [],
        initCategory: categoryResponse.data.data,
      });

      // const imagePreview =
      //   productData.image_url.length > 0 && productData.image_url[0];
      // setDetailData({
      //   title: productData.title,
      //   author: productData.author,
      //   categoryId: productData.category_id,
      //   entryPrice: productData.entry_price,
      //   price: productData.price,
      //   stockQuantity: productData.stock_quantity,
      //   description: productData.description,
      //   images: [],
      //   preview: imagePreview || "",
      //   id: productData.id,
      // });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (param?.productId) {
      getProductDetail(param.productId);
    }
  }, [param]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await productService.updateProductById(detailData);
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
        {/* <Tabs defaultValue="detail">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="detail">Thong tin chi tiet</TabsTrigger>
              <TabsTrigger value="sale">Thong tin ban hang</TabsTrigger>
            </TabsList>
          </div>
        </Tabs> */}
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
