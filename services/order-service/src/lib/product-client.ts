import { BadRequestError, NotFoundError } from '@freeshop/shared-utils';
import config from '../config';

export interface ProductPriceInfo {
  id: string;
  name: string;
  slug: string;
  sellerId: string;
  status: string;
  stock: number;
  unit: string;
  images: string[];
  price: number;
  discountPrice: number | null;
  flashSalePrice: number | null;
  isFlashSale: boolean;
  freeItems?: Array<{ id: string; name: string; sku?: string; image?: string }>;
}

/**
 * Fetch product details from the product-service.
 * Throws NotFoundError if the product does not exist, or BadRequestError
 * if the product is not currently available for purchase.
 */
export async function fetchProduct(productId: string): Promise<ProductPriceInfo> {
  const url = `${config.productServiceUrl}/${productId}`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new Error(`Could not reach product-service: ${(err as Error).message}`);
  }

  if (response.status === 404) {
    throw new NotFoundError(`Product ${productId} not found`);
  }

  if (!response.ok) {
    throw new Error(`Product-service returned ${response.status} for product ${productId}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = (await response.json()) as any;

  // product-service wraps responses in { success, data, message }
  const p = body?.data ?? body;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug ?? '',
    sellerId: p.sellerId ?? '',
    status: p.status,
    stock: Number(p.stock ?? 0),
    unit: p.unit ?? 'piece',
    images: Array.isArray(p.images) ? p.images : [],
    price: Number(p.price),
    discountPrice: p.discountPrice != null ? Number(p.discountPrice) : null,
    flashSalePrice: p.flashSalePrice != null ? Number(p.flashSalePrice) : null,
    isFlashSale: Boolean(p.isFlashSale),
    freeItems: Array.isArray(p.freeItems) ? p.freeItems.map((fi: any) => ({ id: fi.id, name: fi.name, sku: fi.sku, image: fi.image })) : undefined,
  };
}

/**
 * Resolve the effective selling price for a product:
 * - flashSalePrice  (when isFlashSale is active)
 * - discountPrice   (when a discount is set)
 * - price           (base price fallback)
 */
export function resolveEffectivePrice(product: ProductPriceInfo): number {
  if (product.isFlashSale && product.flashSalePrice !== null) {
    return product.flashSalePrice;
  }
  return product.discountPrice ?? product.price;
}
