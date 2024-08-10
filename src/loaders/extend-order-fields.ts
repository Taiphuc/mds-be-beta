export default async function () {
    const importsStore = (await import(
        '@medusajs/medusa/dist/api/routes/store/orders/index'
        )) as any;
    const importsAdmin = (await import(
        '@medusajs/medusa/dist/api/routes/admin/orders/index'
        )) as any;
    importsStore.allowedStoreOrdersFields = [
        ...importsStore.allowedStoreOrdersFields,
        'domain',
        'wooOrderId',
        'wooSyncStatus',
    ];
    importsAdmin.defaultAdminOrdersFields = [
        ...importsAdmin.defaultAdminOrdersFields,
        'domain',
        'wooOrderId',
        'wooSyncStatus',
    ]
}
