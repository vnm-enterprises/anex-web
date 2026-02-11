export type ID = string;

export type Timestamp = {
  createdAt: string; // ISO string
  updatedAt: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
