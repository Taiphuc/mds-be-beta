import type { SettingConfig } from "@medusajs/admin";
import { Envelope } from "@medusajs/icons";
import BackButton from "../../components/shared/back-button";
import BodyCard from "../../components/shared/body-card";
import Spacer from "../../components/shared/spacer";
import { SesSetting } from "../../../models/ses-setting";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { Table, Input, Toaster, useToast } from "@medusajs/ui";
import Spinner from "../../components/shared/spinner";
import { useState, useMemo } from "react";
import EditIcon from "../../components/shared/icons/edit-icon";
import { Check } from "@medusajs/icons";

export type SesSettingGetRes = {
  data: SesSetting;
};

export type SesSettingUpdatePostRes = {
  data: boolean;
};

const CustomSesSetting = () => {
  const { toast } = useToast();
  const [currentSesSettingEdit, setCurrentSesSettingEdit] = useState<any>();

  const { data: dataSes, isLoading, refetch } = useAdminCustomQuery<undefined, SesSettingGetRes>("/ses-setting", []);

  const { mutate, isLoading: isLoadingUpdate } = useAdminCustomPost<any, SesSettingUpdatePostRes>(
    `/ses-setting/update/${currentSesSettingEdit?.id}`,
    []
  );

  const ses = useMemo(() => {
    return {
      id: dataSes?.data.id,
      region: dataSes?.data.region || "",
      key_id: dataSes?.data.key_id || "",
      access_key: dataSes?.data.access_key || "",
      from: dataSes?.data.from,
    };
  }, [dataSes]);

  const columns = [
    {
      title: "#",
      key: "#",
    },

    {
      title: "Region",
      key: "region",
    },
    {
      title: "Key Id",
      key: "key_id",
    },
    {
      title: "Access Key",
      key: "access_key",
    },
    {
      title: "From",
      key: "from",
    },
    {
      title: "Action",
      key: "action",
    },
  ];

  const handleUpdateSes = () => {
    const data = Object.assign({}, currentSesSettingEdit);
    delete data.id;
    mutate(data, {
      onSuccess: (res) => {
        refetch();
        toast({
          title: "Update Successful",
          description: "Update Ses Successful",
          variant: "success",
          duration: 1500,
        });
      },
    });
    setCurrentSesSettingEdit(undefined);
  };

  const handleChange = (event) => {
    setCurrentSesSettingEdit((e) => {
      const data = Object.assign({}, e);
      data[event.target.name] = event.target.value;
      return data;
    });
  };

  return (
    <div>
      <BackButton label="Back to settings" path="/a/settings" className="mb-xsmall" />

      <BodyCard title="Setting Amazon SES" subtitle="Setting Amazon SES">
        <Toaster />
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
              {currentSesSettingEdit?.id ? (
                <Table.Row>
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>
                    <Input
                      value={currentSesSettingEdit.region}
                      onChange={handleChange}
                      name="region"
                      placeholder="Region"
                      size="small"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      value={currentSesSettingEdit.key_id}
                      onChange={handleChange}
                      placeholder="Key Id"
                      name="key_id"
                      size="small"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      value={currentSesSettingEdit.access_key}
                      onChange={handleChange}
                      placeholder="Access Key"
                      name="access_key"
                      size="small"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      value={currentSesSettingEdit.from}
                      onChange={handleChange}
                      placeholder="Cool Company <example@test.com>"
                      name="from"
                      size="small"
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Check cursor={"pointer"} onClick={handleUpdateSes} />
                  </Table.Cell>
                </Table.Row>
              ) : (
                <Table.Row>
                  <Table.Cell>1</Table.Cell>
                  <Table.Cell>{ses.region}</Table.Cell>
                  <Table.Cell>{ses.key_id}</Table.Cell>
                  <Table.Cell>{ses.access_key}</Table.Cell>
                  <Table.Cell>{ses.from}</Table.Cell>
                  <Table.Cell>
                    <EditIcon cursor={"pointer"} size={20} onClick={() => setCurrentSesSettingEdit(ses)} />
                  </Table.Cell>
                </Table.Row>
              )}
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
    label: "Amazon SES",
    description: "Setting Amazon SES",
    icon: Envelope,
  },
};

export default CustomSesSetting;
