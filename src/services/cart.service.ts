import { api } from "@/lib/api-client";
import { CartItem, ResGetCart } from "@/types/cart";
import { trimObjectAttributes } from "@/utils/format";

class CartService {
  async addToCart(data: CartItem) {
    const trimmedData = trimObjectAttributes(data);
    return api.post("/carts/add-to-cart", trimmedData);
  }

  async getCart(): Promise<ResGetCart> {
    return api.get("/carts/get-all");
  }

  async removeFromCart(productId: string) {
    return api.delete(`/carts/remove-from-cart/${productId}`);
  }

  async updateCartItemQuantity(data: CartItem) {
    const trimmedData = trimObjectAttributes(data);
    return api.put("/carts/update", trimmedData);
  }
}

export default new CartService();
