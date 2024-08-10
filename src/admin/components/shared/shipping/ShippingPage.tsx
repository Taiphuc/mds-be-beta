import { RouteProps } from "@medusajs/admin";
import { Tabs } from "@medusajs/ui";
import { FC } from "react";
import BodyCard from "../body-card";
import EstimateShipping from "./estimate-shipping";
import CarrierSlug from "./carrier_slug";

type ShippingPage = {} & RouteProps;

const ShippingPage: FC<ShippingPage> = ({ notify }) => {
  return (
    <BodyCard
      className="h-[800px]"
      title="Shipping"
      subtitle="Manage shipping"
      footerMinHeight={40}
      setBorders
    >
      <Tabs className="mt-4" defaultValue="carrier_slug">
        <Tabs.List>
          <Tabs.Trigger value="carrier_slug">
            Carrier slug
          </Tabs.Trigger>
          <Tabs.Trigger value="estimate_shipping">
            Estimate shipping
          </Tabs.Trigger>
        </Tabs.List>
        <div className="flex flex-col gap-y-4 mt-3">
          <Tabs.Content value="carrier_slug">
            <CarrierSlug notify={notify} />
          </Tabs.Content>
          <Tabs.Content value="estimate_shipping">
            <EstimateShipping notify={notify} />
          </Tabs.Content>
        </div>
      </Tabs>
    </BodyCard>
  );
};
export default ShippingPage;
