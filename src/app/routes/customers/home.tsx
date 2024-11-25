import { ProductStatus } from "@/common/enums";
import ProductLayout from "@/components/layouts/product-layout";
import ProductItemCard from "@/components/product/product-item-card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/shared/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import categoryService from "@/services/category.service";
import productService from "@/services/product.service";
import { Meta } from "@/types/api";
import { Category } from "@/types/category";
import { ResProductDetail } from "@/types/product";
import { Star } from "lucide-react";
import {  useEffect, useMemo, useState } from "react";

interface PriceFilter {
  from: string | undefined
  to: string | undefined
  enable: boolean
}

type ErrorState = {
  price?: string;
};

export default function HomeRoute() {
  const [products, setProducts] = useState<ResProductDetail[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySelect, setCategorySelect] = useState<string[]>([])
  const [priceFilter, setPriceFilter] = useState<PriceFilter>({
    from: undefined,
    to: undefined,
    enable: false
  })
  const [rating, setRating] = useState<string | null>()
  const [checkQuantity, setCheckQuantity] = useState<boolean|undefined>()
  const [errors, setErrors] = useState<ErrorState>({});
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
    const newErrors: ErrorState = {};
    let fakeProducts = products;
    if (categorySelect.length > 0)
    {
     fakeProducts = fakeProducts.filter((product)=> categorySelect.includes(product?.Category?.id || ""))
    }
    if (priceFilter.enable)
    {
      if (priceFilter.from !== undefined && priceFilter.to !== undefined && priceFilter.from > priceFilter.to)
      {
        newErrors.price = "Giá sau phải nhỏ hơn giá trước"
        setErrors(newErrors)
        return fakeProducts
      }
      if (priceFilter.from !== undefined)
      {
          fakeProducts = fakeProducts.filter((product)=> product.price.toLocaleString() >= priceFilter.from!)
      }
      if (priceFilter.to !== undefined)
      {
        fakeProducts = fakeProducts.filter((product)=> product.price.toLocaleString() <= priceFilter.to!)
      }
    }
    if (rating)
    {
      fakeProducts = fakeProducts.filter((product)=> Math.floor(product.avg_stars).toLocaleString() === rating)
    }
    if (checkQuantity)
    {
      fakeProducts = fakeProducts.filter((product)=> product.stock_quantity > 0)
    }
    return fakeProducts
  },[categorySelect, priceFilter, products, rating, checkQuantity])

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
                <div className="flex flex-col">
                  <div className="w-full flex items-center justify-between">
                    <Input value={priceFilter.from} onChange={(e) => setPriceFilter((prev) => {
                      return { ...prev, from: e.target.value }
                    })}
                      placeholder="Từ vnđ" />
                    <span>-</span>
                    <Input value={priceFilter.to} onChange={(e) => setPriceFilter((prev) => {
                      return { ...prev, to: e.target.value }
                    })} placeholder="Đến vnđ"/>
                  </div>
                  <Button onClick={() => setPriceFilter((prev) => {
                    return {...prev, enable: true}
                  })} className="text-white font-semibold text-base rounded-md bg-black w-full py-[10px] text-center">Áp dụng</Button>
                  {errors?.price && (
                <p className="text-red-500 text-xs">{errors.price}</p>
              )}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="bg-white px-[41px] py-[22px] font-semibold text-black">
                Đánh giá
              </AccordionTrigger>
              <AccordionContent className="bg-white px-[41px] py-[11px] font-normal text-black">
                <div className="flex flex-col">
                  <RadioGroup onValueChange={(value)=>setRating(value)} defaultValue="option-one">
                    <div className="flex w-full items-center space-x-2">
                    <RadioGroupItem value="1" id="1"/>
                    <label htmlFor="1" className="text-left text-2xl text-black">
                      1 <Star/>
                    </label>
                  </div>
                  <div className="flex w-full items-center space-x-2">
                    <RadioGroupItem value="2" id="2"/>
                    <label htmlFor="2" className="text-left text-2xl text-black">
                      2 <Star/>
                    </label>
                  </div>
                  <div className="flex w-full items-center space-x-2">
                    <RadioGroupItem value="3" id="3"/>
                    <label htmlFor="3" className="text-left text-2xl text-black">
                      3 <Star/>
                    </label>
                  </div>
                  <div className="flex w-full items-center space-x-2">
                    <RadioGroupItem value="4" id="4"/>
                    <label htmlFor="4" className="text-left text-2xl text-black">
                      4 <Star/>
                    </label>
                  </div>
                  <div className="flex w-full items-center space-x-2">
                    <RadioGroupItem value="5" id="5"/>
                    <label htmlFor="5" className="text-left text-2xl text-black">
                      5 <Star/>
                    </label>
                  </div>
                  </RadioGroup>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="flex flex-col w-full col-span-2">
          <div className="flex items-center gap-2">
            <Input className="w-full text-black text-base bg-white rounded-lg" />
            <Checkbox
                  className="bg-white p-0"
                      id="quantity"
                      checked={checkQuantity}
                      onCheckedChange={() => setCheckQuantity(!checkQuantity)}
                      onClick={(e) => e.stopPropagation()}
                />
                <label htmlFor="quantity" className="text-left text-base text-black">
                  Còn hàng
                </label>
          </div>
          <div className="w-full grid grid-cols-3 gap-4 py-4">
            {filterProducts.map((item, index) => {
              return <ProductItemCard key={index} data={item} />;
            })}
          </div>
        </div>
      </div>
    </ProductLayout>
  );
}
