import { api } from "@/lib/api-client";

class ReviewService {
  async getAllReviews() {
    return api.get("reviews/get-all");
  }
}

export default new ReviewService();
