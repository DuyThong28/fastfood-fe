import { ProductStatus } from "@/common/enums";
import ProductLayout from "@/components/layouts/product-layout";
import ProductItemCard from "@/components/product/product-item-card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/shared/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import categoryService from "@/services/category.service";
import productService from "@/services/product.service";
import { Meta } from "@/types/api";
import { Category } from "@/types/category";
import { ResProductDetail } from "@/types/product";
import {  useEffect, useMemo, useState } from "react";

export default function HomeRoute() {
  const [products, setProducts] = useState<ResProductDetail[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySelect, setCategorySelect]=useState<string[]>([])
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 20,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });
  const [metaCategory, setMetaCategory] = useState<Meta>({
    page: 1,
    take: 50,
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
      }, {status: ProductStatus.ACTIVE});

      setProducts(response.data.data);
      setMeta(response.data.meta);
   
    } catch (err) {
      console.log(err);
    }
  };
  console.log("getAllCategories",categories)
  const getAllCategories = async () => {
        try {
          const response = await categoryService.getAllCategories({page: metaCategory.page, take: metaCategory.take},null);
          setCategories(response.data.data);
          setMetaCategory(response.data.meta)
        } catch (err) {
          console.log(err);
        }
      }
  

  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, [meta.page]);

  console.log("categorySelect", categorySelect)
  
  const filterProducts = useMemo(() => {
    let fakeProducts = products;
    if (categorySelect.length > 0)
    {
     fakeProducts = fakeProducts.filter((product)=> categorySelect.includes(product?.Category?.id || ""))
    }
    return fakeProducts
  },[categorySelect, products])

  return (
    <ProductLayout>
      <div className="grid grid-cols-5">
        <div className="col-span-1 py-4 flex flex-col">
          <Accordion type="single" collapsible className="w-full rounded-none border-b-[1px] border-black text-xl">
            <AccordionItem value="item-1">
              <AccordionTrigger className="bg-white px-[41px] py-[22px] font-semibold text-black">
                Danh mục
              </AccordionTrigger>
              <AccordionContent className="bg-white px-[41px] py-[11px] font-normal text-black">
                {categories && categories.map((val) => (
                  <div key={val.id} className="flex w-full items-center space-x-2">
                <Checkbox
                  className="bg-white p-0"
                      id={val.id}
                      checked={categorySelect.includes(val.id)}
                      onCheckedChange={() => setCategorySelect((prev) => {
                        console.log("Onchange",val.id)
                        if (prev.includes(val.id))
                        {
                          return prev.filter((e)=>e!==val.id)
                        }
                        return [...prev, val.id]
                      })}
                      onClick={(e) => e.stopPropagation()}
                />
                <label htmlFor={val.id} className="text-left text-base text-black">
                  {val.name}
                </label>
              </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="bg-white px-[41px] py-[22px] font-semibold text-black">
                Gia ban
              </AccordionTrigger>
              <AccordionContent className="bg-white px-[41px] py-[11px] font-normal text-black">
                
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="w-full grid grid-cols-3 col-span-2 gap-4 py-4">
          {filterProducts.map((item, index) => {
            return <ProductItemCard key={index} data={item} />;
          })}
        </div>
      </div>
    </ProductLayout>
  );
}
