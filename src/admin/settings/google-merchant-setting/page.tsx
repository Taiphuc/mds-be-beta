import type { SettingConfig } from "@medusajs/admin";
import { Google } from "@medusajs/icons";
import BackButton from "../../components/shared/back-button";
import ProductTab from "../../components/shared/product-tab";
import GoogleMerchantSettings from "../../components/shared/google-merchant-setting";
import { Tabs } from "@medusajs/ui";

const CustomGoogleMerchantSetting = () => {
  return (
    <div>
      <BackButton label="Back to settings" path="/a/settings" className="mb-xsmall" />
      <Tabs defaultValue="1">
        <Tabs.List className="mb-3">
          <Tabs.Trigger value="1">Product settings</Tabs.Trigger>
          <Tabs.Trigger value="2">Google Merchant Setting</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="1">
          <ProductTab />
        </Tabs.Content>
        <Tabs.Content value="2">
          <GoogleMerchantSettings />
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export const config: SettingConfig = {
  card: {
    label: "Google Merchant Center",
    description: "Setting Google Merchant Center",
    icon: Google,
  },
};

export default CustomGoogleMerchantSetting;
