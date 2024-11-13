import { ProductStatus } from "@/common/enums";
import ProductLayout from "@/components/layouts/product-layout";
import ProductItemCard from "@/components/product/product-item-card";
import productService from "@/services/product.service";
import { Meta } from "@/types/api";
import { ResProductDetail } from "@/types/product";
import {  useEffect, useState } from "react";

export default function HomeRoute() {
  const [products, setProducts] = useState<ResProductDetail[]>([]);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 20,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const getAllProducts = async () => {
    try {
      const response = await productService.getAllProducts({
        page: meta.page,
        take: meta.take,
      }, ProductStatus.ACTIVE);

      setProducts(response.data.data);
      setMeta(response.data.meta);
   
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [meta.page]);

  return (
    <ProductLayout>
      <div className="w-full grid grid-cols-5 gap-4 py-4">
        {products.map((item, index) => {
          return <ProductItemCard key={index} data={item} />;
        })}
      </div>
    </ProductLayout>
  );
}
