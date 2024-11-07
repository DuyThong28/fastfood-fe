import DashBoardLayout from "@/components/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import bookService from "@/services/book.service";
import { FormEvent, useEffect, useState } from "react";
import { UpdateBookDetail } from "@/types/book";
import { ProductInfoSection } from "@/components/product/product-info-section";
import categoryService from "@/services/category.service";
import { routes } from "@/config";
// import { ProductInfoSection } from "@/components/product/product-info-section";

export default function ProductDetailRoute() {
  const param = useParams();
  const [detailData, setDetailData] = useState<UpdateBookDetail>({
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

  const getBookDetail = async (id: string) => {
    try {
      const bookResponse = await bookService.getBookById(id);
      const bookData = bookResponse.data.data;
      const categoryResponse = await categoryService.getCategoryById(
        bookData.category_id,
      );

      setDetailData({
        title: bookData.title,
        author: bookData.author,
        price: bookData.price,
        description: bookData.description,
        image_url: bookData.image_url,
        id: bookData.id,
        entryPrice: bookData.entry_price,
        stockQuantity: bookData.stock_quantity,
        categoryId: bookData.category_id,
        images: [],
        initCategory: categoryResponse.data.data,
      });

      // const imagePreview =
      //   bookData.image_url.length > 0 && bookData.image_url[0];
      // setDetailData({
      //   title: bookData.title,
      //   author: bookData.author,
      //   categoryId: bookData.category_id,
      //   entryPrice: bookData.entry_price,
      //   price: bookData.price,
      //   stockQuantity: bookData.stock_quantity,
      //   description: bookData.description,
      //   images: [],
      //   preview: imagePreview || "",
      //   id: bookData.id,
      // });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (param?.bookId) {
      getBookDetail(param.bookId);
    }
  }, [param]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await bookService.updateBookById(detailData);
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
