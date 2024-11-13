import { ReviewStatus } from "@/common/enums";
import { api } from "@/lib/api-client";
import { Page } from "@/types/api";
import { GetAllReviewQueries, GetAllReviews, GetReviewByProductId, ResReview } from "@/types/review";

class ReviewService {
  async getAllReviews(
    { page, take }: Page,
    query: GetAllReviewQueries,
  ): Promise<GetAllReviews> {
    let url = `reviews/get-all?page=${page}&take=${take}`;
    if (query.rating.length > 0) {
      const ratingParams = query.rating
        .map((rating) => `rating[]=${rating}`)
        .join("&");
      url += `&${ratingParams}`;
    } else {
      return {
        data: {
          data: [],
          meta: {
            page: 1,
            take: 20,
            itemCount: 0,
            pageCount: 0,
            hasPreviousPage: false,
            hasNextPage: false,

          }
        }
      }
    }
    if (query.date) {
      url += `&date=${query.date}`;
    }
    if (query.search) {
      url += `&search=${query.search}`;
    }
    if (query.state in ReviewStatus) {
      url += `&state=${query.state}`;
    }
    return api.get(url);
  }

  async getReviewById(id: string) {
    return api.get(`reviews/${id}`);
  }

  async reply(id: string, reply: string) {
    return api.post(`reviews/${id}/reply`, { reply: reply });
  }

  async getReviewsByOrderId(orderId: string): Promise<{ data: { data: ResReview[] } }> {
    return api.get(`reviews/get-review-by-order-id/${orderId}`)
  }

  async getReivewsByProductId({ page, take }: Page, productId: string, query: { rating: number[] }): Promise<GetReviewByProductId> {
    let url = `reviews/get-review-by-product-id/${productId}?page=${page}&take=${take}`;
    if (query.rating.length > 0) {
      const ratingParams = query.rating
        .map((rating) => `rating[]=${rating}`)
        .join("&");
      url += `&${ratingParams}`;
    } else {
      return {
        data: {
          data: [],
          meta: {
            page: 1,
            take: 20,
            itemCount: 0,
            pageCount: 0,
            hasPreviousPage: false,
            hasNextPage: false,

          }
        }
      }
    }
    return api.get(url);
  }
}

export default new ReviewService();
