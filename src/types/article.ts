export interface Article {
  id: string | number;
  weight?: number;
  title: string;
  description: string;
  slug?: string;
  image?: string;
  thumbnailAssetId?: string | null;
  ogImageAssetId?: string | null;
  thumbnailAsset?: ArticleAsset | null;
  ogImageAsset?: ArticleAsset | null;
  date?: string;
}

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonObject
  | JsonValue[];

export type JsonObject = {
  [key: string]: JsonValue;
};

export type ArticleAsset = {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  metadata?: JsonObject | null;
};

export interface ArticleResponse {
  items: Article[];
  total: number;
  limit: number;
  page?: number;
  totalPages?: number;
  nextCursor: number | null;
}
