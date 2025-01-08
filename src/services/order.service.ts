import { ORDER_STATUS } from "@/common/constants/order";
import { OrderStatus } from "@/common/enums";
import { api } from "@/lib/api-client";
import { Page } from "@/types/api";
import {
  CreateOrder,
  ResGetOrderById,
  ResGetOrdersByUser,
  ResPayment,
} from "@/types/order";
import { Review } from "@/types/review";
import { trimObjectAttributes } from "@/utils/format";

class OrderService {
  async getOrdersByUser(
    { page, take }: Page,
    status: string,
    search: string,
  ): Promise<ResGetOrdersByUser> {
    let url = `orders/get-all?page=${page}&take=${take}&search=${search.trim()}&sortBy=created_at&order=desc`;
    if (status !== "all") url += `&status=${status}`;
    return api.get(url);
  }

  async getOrderDetail(id: string): Promise<ResGetOrderById> {
    return api.get(`orders/get-details/${id}`);
  }

  async getOrdersByAdmin(
    { page, take }: Page,
    getOrdersQuery: {
      status: string;
      search: string;
    },
  ): Promise<ResGetOrdersByUser> {
    let url = `/orders/list?page=${page}&take=${take}&search=${getOrdersQuery.search.trim()}&sortBy=created_at&order=desc`;
    if (getOrdersQuery.status in ORDER_STATUS)
      url += `&status=${getOrdersQuery.status}`;
    return api.get(url);
  }

  async getOrderDetailByAdMin(id: string): Promise<ResGetOrderById> {
    return api.get(`orders/get-details-by-admin/${id}`);
  }

  async cancelOrder(id: string) {
    return api.patch(`orders/${id}/cancel-order`);
  }

  async createOrder(data: CreateOrder) {
    const trimmedData = trimObjectAttributes(data);
    return api.post("orders/create", trimmedData);
  }

  async updateOrderStatus({ id, status }: { id: string; status: OrderStatus }) {
    return api.post(`orders/status/update/${id}`, { status: status });
  }

  async reviewProduct({
    orderId,
    orderDetailId,
    productId,
    rating,
    description,
    title,
  }: Review) {
    return api.post(
      `orders/get-details/${orderId}/order-details/${orderDetailId}/${productId}`,
      {
        star: rating,
        description,
        title,
      },
    );
  }

  async createMOMOURL(orderId: string): Promise<ResPayment> {
    return api.post(`orders/create-order-payment-url-with-momo`, { orderId });
  }
}

export default new OrderService();
