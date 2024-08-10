export class UpdateProductSyncToMerchantDto {
  id: string;
  syncToMerchant: boolean;
  variants: { id: string }[];
}
