import type { RouteProps, SettingConfig } from "@medusajs/admin";
import { Check, Star, XMark } from "@medusajs/icons";
import { Input, Table } from "@medusajs/ui";
import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react";
import { useMemo, useState } from "react";
import { AnalyticsSetting } from "../../../models/analytics-setting";
import BackButton from "../../components/shared/back-button";
import BodyCard from "../../components/shared/body-card";
import EditIcon from "../../components/shared/icons/edit-icon";
import Spacer from "../../components/shared/spacer";
import Spinner from "../../components/shared/spinner";

export type AnalyticsSettingGetRes = {
  data: AnalyticsSetting[];
};

export type AnalyticsUpdateSettingPostRes = {
  data: boolean;
};

type TAnalytic = {
  id: string;
  provider: string;
  id_provider: string;
};

const CustomSettingAnalytics = ({ notify }: RouteProps) => {
  const [currentAnalyticsEdit, setCurrentAnalyticsEdit] = useState<TAnalytic>();

  const {
    data: dataAnalyticsSettings,
    isLoading,
    refetch,
  } = useAdminCustomQuery<undefined, AnalyticsSettingGetRes>(
    "/analytics-setting",
    []
  );

  const { mutate, isLoading: isLoadingUpdate } = useAdminCustomPost<
    any,
    AnalyticsUpdateSettingPostRes
  >(`/analytics-setting/update/${currentAnalyticsEdit?.id}`, []);

  const analyticsSettings = useMemo(() => {
    return (
      dataAnalyticsSettings?.data.map((e) => ({
        id: e.id,
        provider: e.provider,
        id_provider: e.id_provider || "",
      })) || []
    );
  }, [dataAnalyticsSettings]);

  const columns = [
    {
      title: "#",
      key: "#",
    },
    {
      title: "Provider",
      key: "provider",
    },
    {
      title: "Provider Id",
      key: "id_provider",
    },
    {
      title: "Action",
      key: "action",
    },
  ];

  const handleUpdateSettingAnalytics = () => {
    const data = Object.assign({}, currentAnalyticsEdit);
    delete data.id;
    mutate(data, {
      onSuccess: () => {
        refetch();
        notify.success("Update Successful", "Update Analytics Successful");
      },
    });
    setCurrentAnalyticsEdit(undefined);
  };

  const handleChange = (event) => {
    setCurrentAnalyticsEdit((e) => {
      const data = Object.assign({}, e);
      if (event.target.name !== "is_sanbox") {
        data[event.target.name] = event.target.value;
      }

      return data;
    });
  };

  return (
    <div>
      <BackButton
        label="Back to settings"
        path="/a/settings"
        className="mb-xsmall"
      />

      <BodyCard title="Setting Analytics" subtitle="Setting Analytics">
        {isLoading || isLoadingUpdate ? (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
            <Spinner variant="secondary" />
          </div>
        ) : (
          <Table>
            <Table.Header>
              <Table.Row>
                {columns.map((e) => (
                  <Table.HeaderCell key={e.key}>{e.title}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {analyticsSettings.map((e, index) => {
                return e.id === currentAnalyticsEdit?.id ? (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{currentAnalyticsEdit.provider}</Table.Cell>
                    <Table.Cell>
                      <Input
                        value={currentAnalyticsEdit.id_provider}
                        onChange={handleChange}
                        name="id_provider"
                        placeholder="Provider Id"
                        size="small"
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-x-2 items-center">
                        <Check
                          cursor={"pointer"}
                          onClick={handleUpdateSettingAnalytics}
                        />
                        <XMark
                          className="cursor-pointer"
                          onClick={() => setCurrentAnalyticsEdit(undefined)}
                        />
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  <Table.Row key={index}>
                    <Table.Cell>{index + 1}</Table.Cell>
                    <Table.Cell>{e.provider}</Table.Cell>
                    <Table.Cell
                      style={{ wordBreak: "break-all", width: "70%" }}
                    >
                      {e.id_provider}
                    </Table.Cell>
                    <Table.Cell>
                      <EditIcon
                        cursor={"pointer"}
                        size={20}
                        onClick={() => setCurrentAnalyticsEdit(e)}
                      />
                    </Table.Cell>
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
    label: "Analytics",
    description: "Setting Analytics",
    icon: Star,
  },
};

export default CustomSettingAnalytics;
