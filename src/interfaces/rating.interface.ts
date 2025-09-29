export interface Rating {
  id: number;
  customer_id: number;
  service_rate: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface GetRatingsResponse {
  data: {
    averageRating: number;
    ratingsCount: number;
    ratings: Rating[];
  };
  message: string;
}
export interface GetRatingsReviewsResponse {
  data: Rating[] | [];
  message: string;
}
