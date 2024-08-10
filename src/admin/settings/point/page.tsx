import type { SettingConfig } from "@medusajs/admin";
import { Gift, Spinner } from "@medusajs/icons";
import BackButton from "../../components/shared/back-button";
import BodyCard from "../../components/shared/body-card";
import Spacer from "../../components/shared/spacer";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { Button, Input, Table, Toaster, useToast } from "@medusajs/ui";
import { useState, useEffect } from "react";
import { SETTING_TYPES } from "../../types/settings";

export type PointRes = {
  vip_member_points: {
    value: string;
    id: number;
  };
  vip_money_to_point_ratio: {
    value: string;
    id: number;
  };
  normal_member_money_to_point_ratio: {
    value: string;
    id: number;
  };
  point_to_money_ratio: {
    value: string;
    id: number;
  };
};
const settingKeys = [
  {
    key: "vip_member_points",
    displayName: "Min purchased for vip member",
  },
  {
    key: "vip_money_to_point_ratio",
    displayName: "Vip member: set ratio of Money to Point (1$ => ? point)",
  },
  {
    key: "normal_member_money_to_point_ratio",
    displayName: "Normal member set ratio of Money to Point (1$ => ? point)",
  },
  {
    key: "point_to_money_ratio",
    displayName: "Set ratio of Point to Money (100 point => ? $)",
  },
];

export type SesSettingUpdatePostRes = {
  data: boolean;
};

const PointSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<any>();

  const {
    data: dataPoint,
    isLoading: isLoadingPoint,
    refetch: refetchPoint,
  } = useAdminCustomQuery<{ type: string }, { point: PointRes }>("/settings", [], {
    type: SETTING_TYPES.point,
  });

  const { mutate, isLoading: isLoadingUpdate } = useAdminCustomPost<any, any>(`/settings/update`, []);

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
        refetchPoint();
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
    const newSettings = [];
    for (const key in dataPoint?.point) {
      newSettings.push(dataPoint?.point?.[key]);
    }
    setSettings(newSettings);
  }, [dataPoint?.point]);

  return (
    <div>
      <BackButton label="Back to settings" path="/a/settings" className="mb-xsmall" />

      <BodyCard title="Setting Customer point" customActionable={<Button onClick={handleUpdate}>Update</Button>}>
        <Toaster />
        {isLoadingPoint ? (
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
              {settingKeys?.map((setting) => {
                return (
                  <Table.Row key={setting?.key}>
                    <Table.Cell>{setting.displayName}</Table.Cell>
                    <Table.Cell>
                      <Input
                        onChange={(e) => {
                          handleChangeSetting(e.currentTarget.value, dataPoint?.point?.[setting.key]?.id);
                        }}
                        defaultValue={dataPoint?.point?.[setting.key]?.value}
                        type="number"
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
    label: "Point",
    description: "Setting Point",
    icon: Gift,
  },
};
export default PointSettings;
