import { Image } from '@medusajs/medusa';

export declare module "@medusajs/medusa/dist/models/product" {
  declare interface Product {
    style?: string;
    isAddShippingProfile?: boolean;
    isSyncFeedForGoogleMerchant?: boolean;
    domain?: string;
    wooProductId?: number;
    syncToMerchant?: boolean;
    rating?: number;
    sizeGuideId?: number;
    soldCount?: number;
  }
}

export declare module "@medusajs/medusa/dist/models/customer" {
  declare interface Customer {
    username: string;
    role: string;
    avatar: string;
    domain: string;
    wooCustomerId: number;
    point: number;
    totalPurchased: number;
  }
}

export declare module "@medusajs/medusa/dist/models/address" {
  declare interface Address {
    email: string;
    state: string;
  }
}

export declare module "@medusajs/medusa/dist/models/order" {
  declare interface Order {
    domain: string;
    wooOrderId: number;
    wooSyncStatus: string;
  }
}

export declare module '@medusajs/medusa/dist/models/product-variant' {
  declare interface ProductVariant {
    images: Image[];
    thumbnail?: string;
    soldCount?: number;
  }
}

