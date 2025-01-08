export const CheckoutTableHeader = () => {
  return (
    <div className="w-full h-10 items-center flex flex-row font-medium text-[#A93F15] text-sm border-b border-gray-300">
      <div className="md:basis-[55%] basis-[30%] px-2 text-left">Sản phẩm</div>
      <div className="md:basis-[15%] basis-[20%] px-2 text-right">Đơn giá</div>
      <div className="md:basis-[15%] basis-[25%] px-2 text-right">Số lượng</div>
      <div className="md:basis-[15%] basis-[25%] px-2 text-right ">Thành tiền</div>
    </div>
  );
};
