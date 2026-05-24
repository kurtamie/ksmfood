/** Normalisasi respons Strapi v4/v5 ke entity datar */

export type StrapiEntityInput<T> =
  | (T & { id?: number; documentId?: string })
  | { id: number; documentId?: string; attributes?: T }
  | null
  | undefined;

export function unwrapStrapiEntity<T extends object>(
  entity: StrapiEntityInput<T>,
): (T & { id: number; documentId?: string }) | null {
  if (!entity) return null;
  if ("attributes" in entity && entity.attributes) {
    return {
      ...(entity.attributes as T),
      id: entity.id,
      documentId: entity.documentId,
    };
  }
  return entity as T & { id: number; documentId?: string };
}

export function unwrapStrapiList<T extends object>(
  rows: unknown,
): Array<T & { id: number; documentId?: string }> {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) => unwrapStrapiEntity<T>(row as StrapiEntityInput<T>))
    .filter((row): row is T & { id: number; documentId?: string } => row != null);
}

export function getStrapiListData(body: unknown): unknown[] {
  if (!body || typeof body !== "object") return [];
  const record = body as { data?: unknown };
  return Array.isArray(record.data) ? record.data : [];
}

export function getStrapiSingleData(body: unknown): unknown {
  if (!body || typeof body !== "object") return null;
  const record = body as { data?: unknown };
  return record.data ?? null;
}
