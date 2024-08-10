import {
  FulfillmentStatus,
  OrderStatus,
  PaymentStatus,
} from '@medusajs/medusa';
import { AwilixContainer } from 'awilix';
import { IsNull, Not } from 'typeorm';
import { uuid } from 'uuidv4';

export enum WOO_SYNC_STATUS {
  NEW = 'NEW',
  PRODUCT_SYNC = 'PRODUCT_SYNC',
  PRODUCT_SYNC_INVALID = 'PRODUCT_SYNC_INVALID',
}

export enum WOO_ORDER_STATUS {
  ANY = 'any',
  PENDING = 'pending',
  PROCESSING = 'processing',
  ON_HOLD = 'on-hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  FAILED = 'failed',
  TRASH = 'trash',
}

const transformStatus = (status: WOO_ORDER_STATUS): OrderStatus => {
  if (
    [
      WOO_ORDER_STATUS.PENDING,
      WOO_ORDER_STATUS.PROCESSING,
      WOO_ORDER_STATUS.ON_HOLD,
    ].includes(status)
  ) {
    return OrderStatus.PENDING;
  }
  if (status === WOO_ORDER_STATUS.COMPLETED) return OrderStatus.COMPLETED;
  if (status === WOO_ORDER_STATUS.CANCELLED) return OrderStatus.CANCELED;
  if ([WOO_ORDER_STATUS.REFUNDED, WOO_ORDER_STATUS.TRASH].includes(status))
    return OrderStatus.ARCHIVED;
  if (status === WOO_ORDER_STATUS.FAILED) return OrderStatus.REQUIRES_ACTION;
  return OrderStatus.ARCHIVED;
};

const transformPaymentStatus = (status: WOO_ORDER_STATUS): PaymentStatus => {
  if (status === WOO_ORDER_STATUS.PENDING) return PaymentStatus.NOT_PAID;
  if (
    [WOO_ORDER_STATUS.PROCESSING, WOO_ORDER_STATUS.ON_HOLD].includes(status)
  ) {
    return PaymentStatus.AWAITING;
  }
  if (status === WOO_ORDER_STATUS.COMPLETED) return PaymentStatus.CAPTURED;
  if (status === WOO_ORDER_STATUS.CANCELLED) return PaymentStatus.CANCELED;
  if (status === WOO_ORDER_STATUS.REFUNDED) return PaymentStatus.REFUNDED;
  return PaymentStatus.REQUIRES_ACTION;
};

const wooSyncOrder = async (
  container: AwilixContainer,
  options: Record<string, any>
) => {
  if (process.env.CRAWL_ORDERS !== 'true') {
    console.log(`🚀 ~ <============== CRAWL ORDERS NOT ENABLE ==============>`);
    return;
  }
  const wooService = container.resolve('wooService');
  const orderRepository = container.resolve('orderRepository');
  const productVariantRepository = container.resolve(
    'productVariantRepository'
  );
  const currencyRepository = container.resolve('currencyRepository');
  const lineItemRepository = container.resolve('lineItemRepository');
  const lineItemTaxLineRepository = container.resolve(
    'lineItemTaxLineRepository'
  );
  const addressRepository = container.resolve('addressRepository');
  const jobSchedulerService = container.resolve('jobSchedulerService');
  const customerRepository = container.resolve('customerRepository');
  const countryRepository = container.resolve('countryRepository');
  const regionRepository = container.resolve('regionRepository');
  const helperService = container.resolve('helperService');

  const stores = [
    {
      domain: process.env.WOO_DOMAIN,
      consumerKey: process.env.WOO_CONSUMER_KEY,
      consumerSecret: process.env.WOO_CONSUMER_SECRET,
    },
  ];

  const createDefaultCustome = async () => {
    const emailNotFoundWoo = 'user.not.found.woo@gmail.com';

    let customer = await customerRepository.findOne({
      where: {
        email: emailNotFoundWoo,
      },
    });

    if (!customer) {
      customer = await customerRepository.save({
        id: uuid(),
        email: emailNotFoundWoo,
        first_name: 'Woo',
        last_name: 'Not Found',
        username: 'Woo Not Found',
      });
    }
    return customer;
  };

  const createBillingAndShipping = async (billingAndShippingData: any[]) => {
    const countryBillingAndShipping = await Promise.all(
      billingAndShippingData.map((e) => {
        return countryRepository.findOne({
          where: {
            iso_2: e.country.toLowerCase(),
          },
        });
      })
    );

    const result = await Promise.all(
      billingAndShippingData.map((e, index) => {
        const obj: any = {
          id: uuid(),
          company: e.company,
          first_name: e.first_name,
          last_name: e.last_name,
          address_1: e.address_1,
          address_2: e.address_2,
          city: e.city,
          postal_code: e.postcode,
          country_code: e.country ? e.country.toLowerCase() : null,
          state: e.state,
          email: e.email,
          phone: e.phone,
        };

        if (countryBillingAndShipping && countryBillingAndShipping[index]) {
          obj.country = countryBillingAndShipping[index];
        }

        return addressRepository.save(obj);
      })
    );

    return result;
  };

  const getDefaultRegion = async () => {
    const regions = await regionRepository.find();
    const result = regions.find((e) => (e.currency_code = 'usd')) || regions[0];
    return result;
  };

  const customerDefault = await createDefaultCustome();
  const regionDefault = await getDefaultRegion();

  const findCustomer = async (
    store: {
      domain: string;
      consumerKey: string;
      consumerSecret: string;
    },
    wooCustomerId: number
  ) => {
    let customer =
      wooCustomerId === 0
        ? customerDefault
        : await customerRepository.findOne({
            where: {
              wooCustomerId,
            },
          });

    if (!customer) {
      const getCustomerByWoo = await wooService.retrieveACustomer(
        store,
        wooCustomerId
      );

      if (getCustomerByWoo && getCustomerByWoo.data) {
        customer = await customerRepository.save({
          id: uuid(),
          domain: store.domain,
          wooCustomerId: getCustomerByWoo.data.id,
          avatar: getCustomerByWoo.data.avatar_url,
          email: getCustomerByWoo.data.email,
          first_name: getCustomerByWoo.data.first_name,
          last_name: getCustomerByWoo.data.last_name,
          username: getCustomerByWoo.data.username,
          role: getCustomerByWoo.data.role,
          phone:
            getCustomerByWoo.data.billing.phone ||
            getCustomerByWoo.data.shipping.phone,
          metadata: getCustomerByWoo.data,
        });
      } else {
        customer = customerDefault;
      }
    }
    return customer;
  };

  const syncOrder = async (
    store: {
      domain: string;
      consumerKey: string;
      consumerSecret: string;
    },
    oneTimes: boolean,
    page: number = 1,
    pageSize: number = 100
  ): Promise<boolean> => {
    const mode = oneTimes ? 'NEWEST' : 'HISTORY';
    console.log(
      `🚀 ~ START MODE:: ${mode} -> SYNC ORDER:: domain: ${store.domain}, page: ${page}, pageSize: ${pageSize}`
    );

    try {
      const wooDataOrders = await wooService.getOrders(store, page, pageSize);

      const wooOrders = wooDataOrders.data;

      if (wooOrders && wooOrders.length) {
        try {
          await Promise.all(
            wooOrders.map(async (wooOrder) => {
              const currency = await currencyRepository.findOne({
                where: {
                  code: wooOrder.currency.toLowerCase(),
                },
              });
              if (!currency) return null;

              const billingAndShippingData = [
                wooOrder.billing,
                wooOrder.shipping,
              ];

              const [customer, billingAndShipping] = await Promise.all([
                findCustomer(store, wooOrder.customer_id),
                createBillingAndShipping(billingAndShippingData),
              ]);

              let metadata: any = JSON.stringify(wooOrder);
              metadata.replaceAll(`\\u0000`, '').replaceAll(`\u0000`, '');
              metadata = JSON.parse(metadata);

              return orderRepository.save({
                id: uuid(),
                domain: store.domain,
                wooOrderId: wooOrder.id,
                wooSyncStatus: WOO_SYNC_STATUS.NEW,
                status: transformStatus(wooOrder.status),
                fulfillment_status: FulfillmentStatus.NOT_FULFILLED,
                payment_status: transformPaymentStatus(wooOrder.status),
                customer_id: customer.id,
                email: customer.email,
                region_id: regionDefault.id,
                currency_code: wooOrder?.currency?.toLowerCase(),
                billing_address_id: billingAndShipping[0].id,
                shipping_address_id: billingAndShipping[1].id,
                metadata,
              });
            })
          );

          if (!oneTimes) {
            await helperService.waitForSecondTime(30);
            await syncOrder(store, false, page + 1, pageSize);
            return;
          }
        } catch (error) {
          console.log('🚀 ~ file: ERROR ORDER SYNC ~ error:', error.message);
          if (!oneTimes) {
            if (
              error.message.search(
                'duplicate key value violates unique constraint'
              ) > -1
            ) {
              await helperService.waitForSecondTime(30);
              await syncOrder(store, false, page + 1, pageSize);
              return;
            }
          }
        }
        console.log(
          `🚀 ~ STOP MODE:: ${mode} -> SYNC ORDER:: domain: ${store.domain}, page: ${page}, pageSize: ${pageSize}`
        );
      } else {
        console.log(
          `🚀 ~ STOP MODE:: ${mode} -> SYNC ORDER:: domain: ${store.domain}, page: ${page}, pageSize: ${pageSize}`
        );
      }
    } catch (error) {
      console.log(
        `🚀 ~ ERROR REQUEST MODE:: ${mode} -> SYNC ORDER:: domain: ${store.domain}, page: ${page}, pageSize: ${pageSize}, error: ${error.message}`
      );
    }
    return true;
  };

  // đồng bộ ngay sau khi khởi động app
  await stores.forEach((e) => syncOrder(e, false));

  // đồng bộ lại history mỗi 12 tiếng
  jobSchedulerService.create(
    'sync-history-customers',
    {},
    '0 0-23/12 * * *',
    async () => {
      await stores.forEach((e) => syncOrder(e, false));
    }
  );

  // đồng bộ mới nhất sau mỗi 10p
  jobSchedulerService.create(
    'sync-newest-customers',
    {},
    '*/10 * * * *',
    async () => {
      await stores.forEach((e) => syncOrder(e, true));
    }
  );

  jobSchedulerService.create(
    'update-line-product-for-order',
    {},
    '*/5 * * * *',
    async () => {
      try {
        const orders = await orderRepository.find({
          where: {
            wooSyncStatus: WOO_SYNC_STATUS.NEW,
            wooOrderId: Not(IsNull()),
          },
          take: 300,
        });

        if (orders && orders.length) {
          const updateOrders = [];

          for (const order of orders) {
            const metadata = order.metadata;

            const lineItemsData = metadata.line_items;
            if (lineItemsData && lineItemsData.length > 0) {
              const checkLineInvalid = lineItemsData.find(
                (e) => e.variation_id === 0
              );

              if (checkLineInvalid) {
                order.wooSyncStatus = WOO_SYNC_STATUS.PRODUCT_SYNC_INVALID;
                updateOrders.push(orderRepository.save(order));
                continue;
              }

              const taxLinesData = metadata.tax_lines;
              const idsVariant = lineItemsData.map((e) => e.variation_id);
              const prodVariants = await Promise.all(
                idsVariant.map((variantId) => {
                  return productVariantRepository
                    .createQueryBuilder('product_variant')
                    .leftJoinAndSelect('product_variant.product', 'product')
                    .where(
                      `product_variant.metadata ::jsonb @> \'{"id": ${variantId}} \'`
                    )
                    .getOne();
                })
              );

              const prodVariantsFilter = prodVariants.filter((e) => e !== null);
              if (prodVariantsFilter.length === lineItemsData.length) {
                const lineItems = await Promise.all(
                  prodVariants.map((prodVar, index) => {
                    return lineItemRepository.save({
                      id: uuid(),
                      order_id: order.id,
                      title: prodVar.product.title,
                      description: prodVar.title,
                      thumbnail: prodVar.product.thumbnail,
                      unit_price: helperService.parseAmountAndMultiply(
                        lineItemsData[index].total,
                        2,
                        100
                      ),
                      variant_id: prodVar.id,
                      quantity: lineItemsData[index].quantity,
                      metadata: lineItemsData[index],
                    });
                  })
                );

                if (taxLinesData[0]) {
                  lineItems.map((line, index) => {
                    return lineItemTaxLineRepository.save({
                      id: uuid(),
                      rate: taxLinesData[0].rate_percent,
                      name: taxLinesData[0].label,
                      code: taxLinesData[0].rate_code,
                      metadata: lineItemsData[index],
                      item_id: line.id,
                    });
                  });
                }
                order.wooSyncStatus = WOO_SYNC_STATUS.PRODUCT_SYNC;
                updateOrders.push(orderRepository.save(order));
              }
            } else {
              order.wooSyncStatus = WOO_SYNC_STATUS.PRODUCT_SYNC_INVALID;
              updateOrders.push(orderRepository.save(order));
            }
          }

          await Promise.all(updateOrders);
        }

        return true;
      } catch (error) {
        console.log(
          `🚀 ~ ERROR UPDATE LINE ITEM PRODUCT FOR ORDER:: ${error.message}`
        );
      }
    }
  );
};

export default wooSyncOrder;
