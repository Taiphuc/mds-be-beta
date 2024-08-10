import type { SettingConfig } from "@medusajs/admin";
import { Link, Spinner } from "@medusajs/icons";
import BackButton from "../../components/shared/back-button";
import BodyCard from "../../components/shared/body-card";
import Spacer from "../../components/shared/spacer";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { Button, Input, Switch, Table, Toaster, useToast } from "@medusajs/ui";
import { useState, useEffect } from "react";
import { SETTING_TYPES } from "../../types/settings";

export type FulfillmentRes = {
  printful_access_token: {
    value: string;
    id: number;
  };
  printful_store_id: {
    value: string;
    id: number;
  };
  printful_enable_webhooks: {
    value: string;
    id: number;
  };
  printful_enable_sync: {
    value: string;
    id: number;
  };
  printful_product_tags: {
    value: string;
    id: number;
  };
  printful_product_categories: {
    value: string;
    id: number;
  };
  printful_confirm_order: {
    value: string;
    id: number;
  };
  printful_batch_size: {
    value: string;
    id: number;
  };
};
const printfulSettingNormalKeys = [
  {
    key: "printful_access_token",
    displayName: "Printful Access Token",
  },
  {
    key: "printful_store_id",
    displayName: "Printful Store Id",
  },

  {
    key: "printful_batch_size",
    displayName: "Printful Batch Size",
  },
];

const printfulSettingSwitchKeys = [
  {
    key: "printful_enable_webhooks",
    displayName: "Printful Enable Webhooks",
  },
  {
    key: "printful_enable_sync",
    displayName: "Printful Enable Sync",
  },
  {
    key: "printful_product_tags",
    displayName: "Printful Product Tags",
  },
  {
    key: "printful_product_categories",
    displayName: "Printful Product Categories",
  },
  {
    key: "printful_confirm_order",
    displayName: "Printful Confirm Order",
  },
];

export type SesSettingUpdatePostRes = {
  data: boolean;
};

const FulfillmentSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<any>();

  const { data, isLoading, refetch } = useAdminCustomQuery<{ type: string }, { fulfillment: FulfillmentRes }>(
    "/settings",
    [],
    {
      type: SETTING_TYPES.fulfillment,
    }
  );

  const { mutate, isLoading: isLoadingUpdate } = useAdminCustomPost<any, any>(`/settings/update`, []);
  const { mutate: updatePrintfulSettings } = useAdminCustomPost<any, any>(`/printful/update-settings`, []);
  const { mutate: startSync } = useAdminCustomPost<any, any>(`/printful/sync`, []);
  const { mutate: createWebhook } = useAdminCustomPost<any, any>(`/printful/create_webhooks`, []);
  const { mutate: createRegions } = useAdminCustomPost<any, any>(`/printful/create_regions`, []);

  const columns: { title: React.ReactNode; key: string; class: string }[] = [
    { title: "Setting name", key: "name", class: "" },
    { title: "value", key: "value", class: "" },
  ];

  const handleChangeSetting = (value: any, id: number) => {
    const newSettings = settings?.map((s) => {
      if (s?.id === id) return { ...s, value };
      return s;
    });
    setSettings(newSettings);
  };

  const handleUpdate = () => {
    mutate(settings, {
      onSuccess() {
        refetch();
        updatePrintfulSettings({});
        toast({
          title: "Update success",
          description: "Update successfully",
          variant: "success",
          duration: 1500,
        });
      },
      onError() {
        toast({
          title: "Update failed",
          description: "Please try again",
          variant: "error",
          duration: 1500,
        });
      },
    });
  };

  useEffect(() => {
    const FulfillmentSettings = [];
    for (const key in data?.fulfillment) {
      FulfillmentSettings.push(data?.fulfillment?.[key]);
    }
    setSettings(FulfillmentSettings);
  }, [data?.fulfillment]);

  return (
    <div>
      <BackButton label="Back to settings" path="/a/settings" className="mb-xsmall" />

      <BodyCard title="Setting PrintFul" customActionable={<Button onClick={handleUpdate}>Update</Button>}>
        <Toaster />

        <div className="w-full flex justify-evenly mb-3">
          <Button
            onClick={() => {
              startSync(
                {},
                {
                  onSuccess: () => {
                    toast({ title: "Start Sync", variant: "success", duration: 600 });
                  },
                }
              );
            }}
          >
            Start sync
          </Button>
          <Button
            onClick={() => {
              createWebhook(
                {},
                {
                  onSuccess: () => {
                    toast({ title: "Start Sync", variant: "success", duration: 600 });
                  },
                }
              );
            }}
          >
            Create webhooks
          </Button>
          <Button
            onClick={() => {
              createRegions(
                {},
                {
                  onSuccess: () => {
                    toast({ title: "Start Sync", variant: "success", duration: 600 });
                  },
                }
              );
            }}
          >
            Create regions
          </Button>
        </div>

        {isLoading ? (
          <div className="w-full flex items-center justify-center h-56">
            <Spinner />
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                {columns.map((e) => (
                  <Table.HeaderCell key={e.key} className={e.class}>
                    {e.title}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {printfulSettingNormalKeys?.map((setting) => {
                return (
                  <Table.Row key={setting.key}>
                    <Table.Cell>{setting.displayName}</Table.Cell>
                    <Table.Cell>
                      <Input
                        onChange={(e) => {
                          handleChangeSetting(e.currentTarget.value, data?.fulfillment?.[setting.key]?.id);
                        }}
                        defaultValue={data?.fulfillment?.[setting.key]?.value}
                      />
                    </Table.Cell>
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                );
              })}

              {printfulSettingSwitchKeys?.map((setting) => {
                return (
                  <Table.Row key={setting.key}>
                    <Table.Cell>{setting.displayName}</Table.Cell>
                    <Table.Cell>
                      <Switch
                        onCheckedChange={(e) => {
                          handleChangeSetting(e ? "1" : "0", data?.fulfillment?.[setting?.key]?.id);
                        }}
                        defaultChecked={toBoolean(data?.fulfillment?.[setting?.key]?.value)}
                      />
                    </Table.Cell>
                    <Table.Cell></Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        )}
      </BodyCard>
      <Spacer />
    </div>
  );
};

export const config: SettingConfig = {
  card: {
    label: "Fulfillment",
    description: "Setting fulfillment",
    icon: Link,
  },
};

function toBoolean(e: any) {
  if (typeof e === "boolean") return e;
  if (typeof e === "string") return e === "true" || e === "1";
  return false;
}
export default FulfillmentSettings;
