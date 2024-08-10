import { WidgetConfig } from "@medusajs/admin";

const AdvancedCssHelper = () => {
  return (
    <style>
      {`
        body .pb-5xlarge .gap-x-base.grid.grid-cols-12 .gap-y-xsmall.col-span-4.flex.flex-col {
            display: none;
        }
        body .pb-5xlarge .gap-x-base.grid.grid-cols-12 .gap-y-xsmall.col-span-8.flex.flex-col {
            grid-column: span 12;
        }
        `}
    </style>
  );
};

export const config: WidgetConfig = {
  zone: "product.details.before",
};

export default AdvancedCssHelper;
