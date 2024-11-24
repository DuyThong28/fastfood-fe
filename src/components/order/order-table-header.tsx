export const OrderTableHeader = () => {
  return (
    <div className="w-full h-10 items-center flex flex-row font-medium text-muted-foreground text-sm border-b border-gray-300">
      <div className="basis-[55%]  px-2 text-left">Sản phẩm</div>
      <div className="basis-1/5  px-2 text-left">Tổng đơn hàng</div>
      <div className="basis-1/5 px-2 text-left">Trạng thái</div>
      <div className="basis-[5%] px-2 text-left ">
        <span className="sr-only">Thao tác</span>
      </div>
    </div>
  );
};
