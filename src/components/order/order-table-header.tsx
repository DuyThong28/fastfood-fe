export const OrderTableHeader = () => {
    return (
      <div className="w-full h-10 items-center flex flex-row font-medium text-muted-foreground text-sm border-b border-gray-300 hover:bg-muted/50">
        <div className="basis-[55%]  px-2 text-left">
          San pham
        </div>
        <div className="basis-1/5  px-2 text-left">
          Tong don hang
        </div>
        <div className="basis-1/5 px-2 text-left">
          Trang thai
        </div>
        <div className="basis-[5%] px-2 text-left ">
          <span className="sr-only">Thao tac</span>
        </div>
      </div>
    );
  };
  