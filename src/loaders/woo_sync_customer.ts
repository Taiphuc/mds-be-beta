import { AwilixContainer } from 'awilix';
import { IsNull, Not } from 'typeorm';
import { uuid } from 'uuidv4';
import { Customer } from 'src/models/customer';

const wooSyncCustomer = async (
  container: AwilixContainer,
  options: Record<string, any>
) => {
  if (process.env.CRAWL_CUSTOMERS !== 'true') {
    console.log(
      `🚀 ~ <============== CRAWL CUSTOMERS NOT ENABLE ==============>`
    );
    return;
  }

  const jobSchedulerService = container.resolve('jobSchedulerService');
  const wooService = container.resolve('wooService');
  const helperService = container.resolve('helperService');

  const customerRepository = container.resolve('customerRepository');
  const countryRepository = container.resolve('countryRepository');
  const addressRepository = container.resolve('addressRepository');

  const stores = [
    {
      domain: process.env.WOO_DOMAIN,
      consumerKey: process.env.WOO_CONSUMER_KEY,
      consumerSecret: process.env.WOO_CONSUMER_SECRET,
    },
  ];

  const createBillingAndShipping = async (
    billingAndShippingData: any[],
    customer: Customer
  ) => {
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
          customer,
        };

        if (countryBillingAndShipping && countryBillingAndShipping[index]) {
          obj.country = countryBillingAndShipping[index];
        }

        return addressRepository.save(obj);
      })
    );

    return result;
  };

  const syncCustomer = async (
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
      `🚀 ~ START MODE:: ${mode} -> SYNC CUSTOMER:: domain: ${store.domain}, page: ${page}, pageSize: ${pageSize}`
    );

    try {
      const wooDataCustomers = await wooService.getCustomers(
        store,
        page,
        pageSize,
        oneTimes ? 'desc' : 'asc'
      );

      const wooCustomers = wooDataCustomers.data;

      if (wooCustomers && wooCustomers.length) {
        try {
          await Promise.all(
            wooCustomers.map((wooCustomer) => {
              return customerRepository.save({
                id: uuid(),
                domain: store.domain,
                wooCustomerId: wooCustomer.id,
                avatar: wooCustomer.avatar_url,
                email: wooCustomer.email,
                first_name: wooCustomer.first_name,
                last_name: wooCustomer.last_name,
                username: wooCustomer.username,
                role: wooCustomer.role,
                phone: wooCustomer.billing.phone || wooCustomer.shipping.phone,
                metadata: wooCustomer,
              });
            })
          );
          if (!oneTimes) {
            await helperService.waitForSecondTime(30);
            await syncCustomer(store, false, page + 1, pageSize);
            return;
          }
        } catch (error) {
          console.log('🚀 ~ file: ERROR CUSTOMER SYNC ~ error:', error.message);
          if (!oneTimes) {
            if (
              error.message.search(
                'duplicate key value violates unique constraint'
              ) > -1
            ) {
              await helperService.waitForSecondTime(30);
              await syncCustomer(store, false, page + 1, pageSize);
              return;
            }
          }
        }
        console.log(
          `🚀 ~ STOP MODE:: ${mode} -> SYNC CUSTOMER:: domain: ${store.domain}, page: ${page}, pageSize: ${pageSize}`
        );
      } else {
        console.log(
          `🚀 ~ STOP MODE:: ${mode} -> SYNC CUSTOMER:: domain: ${store.domain}, page: ${page}, pageSize: ${pageSize}`
        );
      }
    } catch (error) {
      console.log(
        `🚀 ~ ERROR REQUEST MODE:: ${mode} -> SYNC CUSTOMER:: domain: ${store.domain}, page: ${page}, pageSize: ${pageSize}, error: ${error.message}`
      );
    }
    return true;
  };

  // đồng bộ ngay sau khi khởi động app
  await stores.forEach((e) => syncCustomer(e, false));

  // đồng bộ lại history mỗi 12 tiếng
  jobSchedulerService.create(
    'sync-history-customers',
    {},
    '0 0-23/12 * * *',
    async () => {
      await stores.forEach((e) => syncCustomer(e, false));
    }
  );

  // đồng bộ mới nhất sau mỗi 10p
  jobSchedulerService.create(
    'sync-newest-customers',
    {},
    '*/10 * * * *',
    async () => {
      await stores.forEach((e) => syncCustomer(e, true));
    }
  );

  jobSchedulerService.create(
    'create-billing-shipping-customers',
    {},
    '*/1 * * * *',
    async () => {
      try {
        const customers = await customerRepository.find({
          where: {
            billing_address_id: IsNull(),
            wooCustomerId: Not(IsNull()),
          },
          limit: 100,
        });

        if (customers && customers.length) {
          for (const customer of customers) {
            try {
              const metadata = customer.metadata;
              const billingAndShippingData = [
                metadata.billing,
                metadata.shipping,
              ];

              const billingAndShipping = await createBillingAndShipping(
                billingAndShippingData,
                customer
              );

              const billing = billingAndShipping[0];
              customer.billing_address_id = billing.id;
              await customerRepository.save(customer);
            } catch (error) {
              console.log(
                `🚀 ~ ERROR UPDATE BILLING SHIPPING CUSTOMER:: ${error.message}, customer: ${customer.id}`
              );
            }
          }
        }
        return true;
      } catch (error) {
        console.log(
          `🚀 ~ ERROR UPDATE BILLING SHIPPING CUSTOMER:: ${error.message}`
        );
      }
    }
  );
};

export default wooSyncCustomer;
