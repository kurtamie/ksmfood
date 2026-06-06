/** Format relasi Strapi v5 (connect dengan documentId atau id numerik) */

export function buildStrapiRelationConnect(
  id: number,
  documentId?: string | null,
): number | { connect: string[] | number[] } {
  if (documentId) {
    return { connect: [documentId] };
  }
  return id;
}
