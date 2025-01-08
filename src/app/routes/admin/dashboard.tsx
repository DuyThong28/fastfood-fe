import DashBoardLayout from "@/components/layouts/dashboard-layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { OrderTableHeader } from "@/components/order/order-table-header";
import { OrderTableRow } from "@/components/order/order-table-row";
import { TablePagination } from "@/components/shared/table-pagination";
import { Order } from "@/types/order";
import { Meta } from "@/types/api";
import orderService from "@/services/order.service";
import { useEffect, useState } from "react";
import { Customer } from "@/types/customer";
import { Product } from "@/types/product";
import { api } from "@/lib/api-client";
import { formatNumber } from "@/utils/format";

export default function DashboardRoute() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [numberOfCustomers, setNumberOfCustomers] = useState<number>(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [meta, setMeta] = useState<Meta>({
    page: 1,
    take: 5,
    itemCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  const getAllCustomers = async () => {
    try {
      const response = await api.get("/statistics/totalCustomerBought");
      setNumberOfCustomers(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getAllProducts = async () => {
    try {
      const response = await api.get("/products/get-all");
      setProducts(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getOrdersByAdmin = async () => {
    try {
      const response = await api.get("/orders/list?status=SUCCESS");
      const ordersData = response.data.data;
      setOrders(ordersData);

      const recentResponse = await orderService.getOrdersByAdmin(
        {
          page: meta.page,
          take: meta.take,
        },
        { status: "", search: "" }
      );
      setRecentOrders(recentResponse.data.data);

      const total = ordersData.reduce((acc: number, order: Order) => {
        return acc + Number(order.total_price);
      }, 0);

      setTotalPrice(total);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllProducts();
    getAllCustomers();
    getOrdersByAdmin();
  }, []);

  return (
    <DashBoardLayout>
      <main className="flex flex-1 flex-col gap-6 p-6  bg-muted/40 overflow-y-auto">
        <h1 className="text-2xl font-bold text-[#A93F15]">Trang Chủ</h1>
        <div className="flex gap-x-5">
          <Card className="w-1/2 p-2 rounded-lg shadow-md hover:shadow pb-0">
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col text-[#A93F15]">
                  <h2 className="text-lg font-semibold text-[#FF7E00]">
                    Tổng doanh thu
                  </h2>
                  <p className="text-lg font-bold">
                    {formatNumber(totalPrice)}
                  </p>
                  <p className="text-sm font-bold mt-2">
                    Tổng số tiền thu được từ các đơn hàng
                  </p>
                </div>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.625 46.875C18.964 46.8641 32.245 48.6305 45.1175 52.1275C46.935 52.6225 48.75 51.2725 48.75 49.3875V46.875M9.375 11.25V13.125C9.375 13.6223 9.17746 14.0992 8.82583 14.4508C8.47419 14.8025 7.99728 15 7.5 15H5.625M5.625 15V14.0625C5.625 12.51 6.885 11.25 8.4375 11.25H50.625M5.625 15V37.5M50.625 11.25V13.125C50.625 14.16 51.465 15 52.5 15H54.375M50.625 11.25H51.5625C53.115 11.25 54.375 12.51 54.375 14.0625V38.4375C54.375 39.99 53.115 41.25 51.5625 41.25H50.625M5.625 37.5V38.4375C5.625 39.1834 5.92132 39.8988 6.44876 40.4262C6.97621 40.9537 7.69158 41.25 8.4375 41.25H9.375M5.625 37.5H7.5C7.99728 37.5 8.47419 37.6975 8.82583 38.0492C9.17746 38.4008 9.375 38.8777 9.375 39.375V41.25M50.625 41.25V39.375C50.625 38.8777 50.8225 38.4008 51.1742 38.0492C51.5258 37.6975 52.0027 37.5 52.5 37.5H54.375M50.625 41.25H9.375M37.5 26.25C37.5 28.2391 36.7098 30.1468 35.3033 31.5533C33.8968 32.9598 31.9891 33.75 30 33.75C28.0109 33.75 26.1032 32.9598 24.6967 31.5533C23.2902 30.1468 22.5 28.2391 22.5 26.25C22.5 24.2609 23.2902 22.3532 24.6967 20.9467C26.1032 19.5402 28.0109 18.75 30 18.75C31.9891 18.75 33.8968 19.5402 35.3033 20.9467C36.7098 22.3532 37.5 24.2609 37.5 26.25ZM45 26.25H45.02V26.27H45V26.25ZM15 26.25H15.02V26.27H15V26.25Z"
                    stroke="#A93F15"
                    stroke-width="3.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
          <Card className="w-1/2 p-2 rounded-lg shadow-md hover:shadow">
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col text-[#A93F15]">
                  <h2 className="text-lg font-semibold text-[#FF7E00]">
                    Tổng đơn hàng
                  </h2>
                  <p className="text-lg font-bold">{orders.length}</p>
                  <p className="text-sm font-bold mt-2">
                    Số lượng đơn hàng thành công
                  </p>
                </div>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M39.3751 26.25V15C39.3751 12.5136 38.3874 10.129 36.6292 8.37087C34.8711 6.61272 32.4865 5.625 30.0001 5.625C27.5137 5.625 25.1291 6.61272 23.371 8.37087C21.6128 10.129 20.6251 12.5136 20.6251 15V26.25M49.0151 21.2675L52.1726 51.2675C52.3476 52.93 51.0476 54.375 49.3751 54.375H10.6251C10.2306 54.3754 9.84045 54.2929 9.47996 54.1327C9.11947 53.9725 8.79671 53.7382 8.53264 53.4452C8.26858 53.1521 8.06912 52.8068 7.94722 52.4316C7.82532 52.0564 7.78371 51.6598 7.82508 51.2675L10.9851 21.2675C11.058 20.5764 11.3841 19.9368 11.9007 19.4719C12.4173 19.007 13.0877 18.7499 13.7826 18.75H46.2176C47.6576 18.75 48.8651 19.8375 49.0151 21.2675ZM21.5626 26.25C21.5626 26.4986 21.4638 26.7371 21.288 26.9129C21.1122 27.0887 20.8737 27.1875 20.6251 27.1875C20.3764 27.1875 20.138 27.0887 19.9622 26.9129C19.7864 26.7371 19.6876 26.4986 19.6876 26.25C19.6876 26.0014 19.7864 25.7629 19.9622 25.5871C20.138 25.4113 20.3764 25.3125 20.6251 25.3125C20.8737 25.3125 21.1122 25.4113 21.288 25.5871C21.4638 25.7629 21.5626 26.0014 21.5626 26.25ZM40.3126 26.25C40.3126 26.4986 40.2138 26.7371 40.038 26.9129C39.8622 27.0887 39.6237 27.1875 39.3751 27.1875C39.1264 27.1875 38.888 27.0887 38.7122 26.9129C38.5364 26.7371 38.4376 26.4986 38.4376 26.25C38.4376 26.0014 38.5364 25.7629 38.7122 25.5871C38.888 25.4113 39.1264 25.3125 39.3751 25.3125C39.6237 25.3125 39.8622 25.4113 40.038 25.5871C40.2138 25.7629 40.3126 26.0014 40.3126 26.25Z"
                    stroke="#A93F15"
                    stroke-width="3.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
          <Card className="w-1/2 p-2 rounded-lg shadow-md hover:shadow">
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col text-[#A93F15]">
                  <h2 className="text-lg font-semibold text-[#FF7E00]">
                    Tổng khách hàng
                  </h2>
                  <p className="text-lg font-bold">{numberOfCustomers}</p>
                  <p className="text-sm font-bold mt-2">
                    Số lượng người dùng đã đặt hàng
                  </p>
                </div>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M42.6476 38.8025C43.8171 38.0039 45.1888 37.5527 46.604 37.5011C48.0192 37.4495 49.4201 37.7997 50.6446 38.5111C51.8691 39.2224 52.8672 40.266 53.5234 41.5209C54.1796 42.7759 54.4671 44.191 54.3526 45.6025C51.353 46.6508 48.167 47.0588 45.0001 46.8C44.9904 43.9666 44.1744 41.1919 42.6476 38.805C41.2924 36.6795 39.4229 34.9301 37.2122 33.7188C35.0014 32.5074 32.5209 31.8733 30.0001 31.875C27.4797 31.8737 24.9997 32.5081 22.7894 33.7194C20.5792 34.9307 18.7101 36.6798 17.3551 38.805M44.9976 46.7975L45.0001 46.875C45.0001 47.4375 44.9701 47.9925 44.9076 48.54C40.371 51.1428 35.2303 52.5084 30.0001 52.5C24.5751 52.5 19.4826 51.06 15.0926 48.54C15.0283 47.9614 14.9974 47.3796 15.0001 46.7975M15.0001 46.7975C11.8342 47.0657 8.64985 46.6592 5.65258 45.605C5.53846 44.1939 5.82607 42.7793 6.48216 41.5247C7.13824 40.2702 8.13601 39.227 9.36009 38.5157C10.5842 37.8044 11.9846 37.4541 13.3994 37.5053C14.8142 37.5565 16.1856 38.0071 17.3551 38.805M15.0001 46.7975C15.0091 43.9643 15.8291 41.1922 17.3551 38.805M37.5001 16.875C37.5001 18.8641 36.7099 20.7718 35.3034 22.1783C33.8969 23.5848 31.9892 24.375 30.0001 24.375C28.011 24.375 26.1033 23.5848 24.6968 22.1783C23.2903 20.7718 22.5001 18.8641 22.5001 16.875C22.5001 14.8859 23.2903 12.9782 24.6968 11.5717C26.1033 10.1652 28.011 9.375 30.0001 9.375C31.9892 9.375 33.8969 10.1652 35.3034 11.5717C36.7099 12.9782 37.5001 14.8859 37.5001 16.875ZM52.5001 24.375C52.5001 25.1137 52.3546 25.8451 52.0719 26.5276C51.7892 27.2101 51.3749 27.8301 50.8526 28.3525C50.3302 28.8748 49.7101 29.2891 49.0277 29.5718C48.3452 29.8545 47.6138 30 46.8751 30C46.1364 30 45.4049 29.8545 44.7225 29.5718C44.04 29.2891 43.4199 28.8748 42.8976 28.3525C42.3753 27.8301 41.9609 27.2101 41.6783 26.5276C41.3956 25.8451 41.2501 25.1137 41.2501 24.375C41.2501 22.8832 41.8427 21.4524 42.8976 20.3975C43.9525 19.3426 45.3832 18.75 46.8751 18.75C48.3669 18.75 49.7977 19.3426 50.8526 20.3975C51.9075 21.4524 52.5001 22.8832 52.5001 24.375ZM18.7501 24.375C18.7501 25.1137 18.6046 25.8451 18.3219 26.5276C18.0392 27.2101 17.6249 27.8301 17.1026 28.3525C16.5802 28.8748 15.9601 29.2891 15.2777 29.5718C14.5952 29.8545 13.8638 30 13.1251 30C12.3864 30 11.6549 29.8545 10.9725 29.5718C10.29 29.2891 9.66994 28.8748 9.14761 28.3525C8.62528 27.8301 8.21095 27.2101 7.92826 26.5276C7.64558 25.8451 7.50008 25.1137 7.50008 24.375C7.50008 22.8832 8.09272 21.4524 9.14761 20.3975C10.2025 19.3426 11.6332 18.75 13.1251 18.75C14.6169 18.75 16.0477 19.3426 17.1026 20.3975C18.1575 21.4524 18.7501 22.8832 18.7501 24.375Z"
                    stroke="#A93F15"
                    stroke-width="3.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
          <Card className="w-1/2 p-2 rounded-lg shadow-md hover:shadow">
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col text-[#A93F15]">
                  <h2 className="text-lg font-semibold text-[#FF7E00]">
                    Tổng sản phẩm
                  </h2>
                  <p className="text-lg font-bold">{products.length}</p>
                  <p className="text-sm font-bold mt-2">Số lượng sản phẩm</p>
                </div>
                <svg
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M37.7344 48.75C37.7344 52.8926 35.3145 56.25 31.1719 56.25H15.7031C11.5605 56.25 9.14062 52.8926 9.14062 48.75M39.375 39.375C41.4457 39.375 43.125 41.4738 43.125 44.0625C43.125 46.6512 41.4457 48.75 39.375 48.75H7.5C5.4293 48.75 3.75 46.6512 3.75 44.0625C3.75 41.4738 5.4293 39.375 7.5 39.375"
                    stroke="#A93F15"
                    stroke-width="3.75"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                  />
                  <path
                    d="M7.5 32.3437V32.318C7.5 25.8727 12.7734 22.5 19.2188 22.5H27.6562C34.1016 22.5 39.375 25.8984 39.375 32.3437V32.318M28.2422 13.125L29.1141 20.6215M40.3125 39.375H21.0129C20.7646 39.3751 20.5265 39.4737 20.3508 39.6492L17.2066 42.7934C17.1631 42.8369 17.1114 42.8715 17.0545 42.8951C16.9976 42.9187 16.9366 42.9308 16.875 42.9308C16.8134 42.9308 16.7524 42.9187 16.6955 42.8951C16.6386 42.8715 16.5869 42.8369 16.5434 42.7934L13.3992 39.6492C13.2235 39.4737 12.9854 39.3751 12.7371 39.375H6.5625C5.81658 39.375 5.10121 39.0787 4.57376 38.5512C4.04632 38.0238 3.75 37.3084 3.75 36.5625C3.75 35.8166 4.04632 35.1012 4.57376 34.5738C5.10121 34.0463 5.81658 33.75 6.5625 33.75H40.3125C41.0584 33.75 41.7738 34.0463 42.3012 34.5738C42.8287 35.1012 43.125 35.8166 43.125 36.5625C43.125 37.3084 42.8287 38.0238 42.3012 38.5512C41.7738 39.0787 41.0584 39.375 40.3125 39.375Z"
                    stroke="#A93F15"
                    stroke-width="3.75"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                  />
                  <path
                    d="M30 56.25H46.3254C47.2715 56.25 48.1826 55.8924 48.876 55.2489C49.5695 54.6054 49.9942 53.7235 50.0648 52.7801L54.2578 13.125"
                    stroke="#A93F15"
                    stroke-width="3.75"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                  />
                  <path
                    d="M43.125 13.125L45 5.625L50.5078 3.75"
                    stroke="#A93F15"
                    stroke-width="3.75"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M26.25 13.125H56.25"
                    stroke="#A93F15"
                    stroke-width="3.75"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#A93F15]">
              Đơn hàng gần đây
            </h3>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <div className="space-y-4">
              <OrderTableHeader />
              {recentOrders.map((item, index) => {
                return <OrderTableRow key={index} data={item} />;
              })}
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50">
            <TablePagination data={meta} onChange={setMeta} />
          </CardFooter>
        </Card>
      </main>
    </DashBoardLayout>
  );
}
