/**
 * GUARDMAN V3 - Seed Helpers
 */

export async function upsert(
  payload: any,
  collection: string,
  where: Record<string, any>,
  data: Record<string, any>,
): Promise<number> {
  const existing = await payload.find({ collection, where, limit: 1 })
  if (existing.totalDocs > 0) {
    const doc = await payload.update({
      collection,
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    })
    return doc.id
  }
  const doc = await payload.create({ collection, data, overrideAccess: true })
  return doc.id
}
