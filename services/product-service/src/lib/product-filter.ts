/**
 * Filter product response based on user role
 * - Vendors should NOT see the `price` field (retail price set by admin)
 * - Vendors should see `supplierPrice` (their cost)
 * - Customers and Admins should see both fields
 */
export function filterProductForUser(product: any, userRole?: string): any {
  if (!product) return product;
  
  // If user is a vendor, exclude the price field
  if (userRole === 'VENDOR') {
    const { price, ...filteredProduct } = product;
    return filteredProduct;
  }
  
  // For customers, admins, and public users, return full product
  return product;
}

/**
 * Filter an array of products for a specific user
 */
export function filterProductsForUser(products: any[], userRole?: string): any[] {
  return products.map(product => filterProductForUser(product, userRole));
}

/**
 * Filter paginated result of products
 */
export function filterPaginatedProductsForUser(result: any, userRole?: string): any {
  if (!result) return result;
  
  return {
    ...result,
    data: filterProductsForUser(result.data, userRole),
  };
}
