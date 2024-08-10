export default async function () {
  const imports = (await import(
    '@medusajs/medusa/dist/api/routes/store/products/index'
  )) as any;
  imports.allowedStoreProductsFields = [
    ...imports.allowedStoreProductsFields,
    'style',
    'isAddShippingProfile',
    'isSyncFeedForGoogleMerchant',
    'domain',
    'rating',
    'wooProductId',
    'syncToMerchant',
    'sizeGuideId',
    'soldCount'
  ];
  imports.defaultStoreProductsFields = [
    ...imports.defaultStoreProductsFields,
    'style',
    'isAddShippingProfile',
    'isSyncFeedForGoogleMerchant',
    'domain',
    'wooProductId',
    'syncToMerchant',
    'rating',
    'sizeGuideId',
    'soldCount'
  ];

  const adminProductImports = (await import(
    '@medusajs/medusa/dist/api/routes/admin/products/index'
  )) as any;

  const storeProductImports = (await import(
    '@medusajs/medusa/dist/api/routes/store/products/index'
  )) as any;

  adminProductImports.defaultAdminProductRelations = [
    ...adminProductImports.defaultAdminProductRelations,
    'variants.images',
  ];

  storeProductImports.defaultStoreProductsRelations = [
    ...storeProductImports.defaultStoreProductsRelations,
    'variants.images',
  ]

  storeProductImports.allowedStoreProductsRelations = [
    ...storeProductImports.allowedStoreProductsRelations,
    'variants.images',
  ]

  adminProductImports.allowedAdminProductsFields = [
    ...adminProductImports.allowedAdminProductsFields,
    'style',
    'isAddShippingProfile',
    'isSyncFeedForGoogleMerchant',
    'domain',
    'rating',
    'wooProductId',
    'syncToMerchant',
    'sizeGuideId',
    'soldCount'
  ];
  adminProductImports.defaultAdminProductsFields = [
    ...adminProductImports.defaultAdminProductsFields,
    'style',
    'isAddShippingProfile',
    'isSyncFeedForGoogleMerchant',
    'domain',
    'wooProductId',
    'syncToMerchant',
    'rating',
    'sizeGuideId',
    'soldCount'
  ];
}
