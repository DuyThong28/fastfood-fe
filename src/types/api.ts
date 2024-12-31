export type Page = {
  page: number;
  take: number;
};

export type Meta = Page & {
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type Respone = {
  status?: number;
  message?: string;
  data: unknown;
};
