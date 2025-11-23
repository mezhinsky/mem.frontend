export interface Article {
  id: string | number;
  title: string;
  description: string;
  slug?: string;
  image?: string;
  date?: string;
}

export interface ArticleResponse {
  items: Article[];
  total: number;
  limit: number;
  page?: number;
  totalPages?: number;
  nextCursor: number | null;
}
