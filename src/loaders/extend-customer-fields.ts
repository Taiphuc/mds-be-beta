export default async function () {
  const importsStore = (await import(
    '@medusajs/medusa/dist/api/routes/store/customers/index'
  )) as any;
  importsStore.allowedStoreCustomersFields = [
    ...importsStore.allowedStoreCustomersFields,
    'username',
    'role',
    'avatar',
    'domain',
    'wooCustomerId',
    'point',
    'totalPurchased'
  ];
  importsStore.defaultStoreCustomersFields = [
    ...importsStore.defaultStoreCustomersFields,
    'username',
    'role',
    'avatar',
    'domain',
    'wooCustomerId',
    'point',
    'totalPurchased'
  ];

  const importsAdmin = (await import(
    '@medusajs/medusa/dist/api/routes/admin/customers/index'
  )) as any;

  importsAdmin.allowedStoreCustomersFields = [
    ...importsAdmin.allowedStoreCustomersFields,
    'username',
    'role',
    'avatar',
    'domain',
    'wooCustomerId',
    'point',
    'totalPurchased'
  ];
  importsAdmin.defaultStoreCustomersFields = [
    ...importsAdmin.defaultStoreCustomersFields,
    'username',
    'role',
    'avatar',
    'domain',
    'wooCustomerId',
    'point',
    'totalPurchased'
  ];
}
