export interface BaseEntity {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
}

export interface MediaItem extends BaseEntity {
  name?: string | null;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  url?: string;
  mime?: string | null;
  size?: number | null;
  provider?: string | null;
  previewUrl?: string | null;
}
