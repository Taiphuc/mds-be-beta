import axios from 'axios';
import { TransactionBaseService } from '@medusajs/medusa';

class WooService extends TransactionBaseService {
  headerWooByStore(store: {
    domain: string;
    consumerKey: string;
    consumerSecret: string;
  }) {
    return {
      Authorization: `Basic ${btoa(
        store.consumerKey + ':' + store.consumerSecret
      )}`,
      'Content-Type': 'application/json; charset=utf-8',
    };
  }

  async getProducts(
    store: {
      domain: string;
      consumerKey: string;
      consumerSecret: string;
    },
    page: number,
    perPage: number,
    order = 'asc'
  ) {
    const headers: any = this.headerWooByStore(store);

    const data = await axios(
      `https://${store.domain}/wp-json/wc/v3/products?page=${page}&per_page=${perPage}&order=${order}&orderby=id`,
      {
        method: 'get',
        headers,
      }
    );
    return data;
  }

  async getProductVariations(
    store: {
      domain: string;
      consumerKey: string;
      consumerSecret: string;
    },
    productId: number
  ) {
    const headers: any = this.headerWooByStore(store);

    const data = await axios(
      `https://${store.domain}/wp-json/wc/v3/products/${productId}/variations`,
      {
        method: 'get',
        headers,
      }
    );
    return data;
  }

  async getCustomers(
    store: {
      domain: string;
      consumerKey: string;
      consumerSecret: string;
    },
    page: number,
    perPage: number,
    order = 'asc'
  ) {
    const headers: any = this.headerWooByStore(store);

    const data = await axios(
      `https://${store.domain}/wp-json/wc/v3/customers?page=${page}&per_page=${perPage}&order=${order}&orderby=id`,
      {
        method: 'get',
        headers,
      }
    );
    return data;
  }

  async retrieveACustomer(
    store: {
      domain: string;
      consumerKey: string;
      consumerSecret: string;
    },
    customerId: number
  ) {
    const headers: any = this.headerWooByStore(store);

    const data = await axios(
      `https://${store.domain}/wp-json/wc/v3/customers/${customerId}`,
      {
        method: 'get',
        headers,
      }
    );
    return data;
  }

  async getOrders(
    store: {
      domain: string;
      consumerKey: string;
      consumerSecret: string;
    },
    page: number,
    perPage: number,
    order = 'asc'
  ) {
    const headers: any = this.headerWooByStore(store);

    const data = await axios(
      `https://${store.domain}/wp-json/wc/v3/orders?page=${page}&per_page=${perPage}&order=${order}&orderby=id`,
      {
        method: 'get',
        headers,
      }
    );
    return data;
  }
}

export default WooService;
