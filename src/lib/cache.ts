import { revalidateTag, unstable_cache } from "next/cache";

export type ValidTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getUserTag>
  | ReturnType<typeof getIdTag>;

export const CACHE_TAGS = {
  products: "products",
  productViews: "productViews",
  subscription: "subscription",
  countries: "countries",
  countryGroups: "countryGroups",
} as const;

export function getGlobalTag(tag: keyof typeof CACHE_TAGS): `global:${string}` {
  return `global:${CACHE_TAGS[tag]}`;
}

export function getUserTag(
  userId: string,
  tag: keyof typeof CACHE_TAGS
): `user:${string}` {
  return `user:${userId}-${CACHE_TAGS[tag]}`;
}

export function getIdTag(id: string, tag: keyof typeof CACHE_TAGS): `id:${string}` {
  return `id:${id}-${CACHE_TAGS[tag]}`;
}

export function clearFullCache() {
  revalidateTag("*");
}

export function dbCache<Args extends unknown[], ReturnType>(
  cb: (...args: Args) => Promise<ReturnType>,
  { tags }: { tags: ValidTags[] }
): (...args: Args) => Promise<ReturnType> {
  return unstable_cache(cb, undefined, { tags: [...tags, "*"] });
}

export function revalidateDbCache({
  tag,
  userId,
  id,
}: {
  tag: keyof typeof CACHE_TAGS;
  userId?: string;
  id?: string;
}) {
  revalidateTag(getGlobalTag(tag));
  if (userId) {
    revalidateTag(getUserTag(userId, tag));
  }
  if (id) {
    revalidateTag(getIdTag(id, tag));
  }
}
