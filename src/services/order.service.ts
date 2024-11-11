import { ORDER_STATUS } from "@/common/constants/order";
import { OrderStatus } from "@/common/enums";
import { api } from "@/lib/api-client";
import { Page } from "@/types/api";
import {
  CreateOrder,
  ResGetOrderById,
  ResGetOrdersByUser,
} from "@/types/order";
import { Review } from "@/types/review";

class OrderService {
  async getOrdersByUser(
    { page, take }: Page,
    status: string,
    search: string
  ): Promise<ResGetOrdersByUser> {
    if (status === "all")
      return api.get(`orders/get-all?page=${page}&take=${take}&search=${search}`);
    else
      return api.get(
        `orders/get-all?page=${page}&take=${take}&status=${status}&search=${search}`,
      );
  }

  async getOrderDetail(id: string): Promise<ResGetOrderById> {
    return api.get(`orders/get-details/${id}`);
  }

  async getOrdersByAdmin(
    { page, take }: Page,
    getOrdersQuery: {
      status: string,
      search: string,
    }
  ): Promise<ResGetOrdersByUser> {
    let url = `/orders/list?page=${page}&take=${take}&search=${getOrdersQuery.search}`;
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
    return api.post("orders/create", data);
  }

  async updateOrderStatus({ id, status }: { id: string; status: OrderStatus }) {
    return api.post(`orders/status/update/${id}`, { status: status });
  }

  async reviewBook({
    orderId,
    orderDetailId,
    bookId,
    rating,
    description,
    title,
  }: Review) {
    return api.post(
      `orders/get-details/${orderId}/order-details/${orderDetailId}/${bookId}`,
      {
        star: rating,
        description,
        title,
      },
    );
  }
}

export default new OrderService();
