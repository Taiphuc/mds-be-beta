import type { SettingConfig } from "@medusajs/admin";
import { ChatBubble, Spinner } from "@medusajs/icons";
import BackButton from "../../components/shared/back-button";
import BodyCard from "../../components/shared/body-card";
import Spacer from "../../components/shared/spacer";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { Button, Input, Select, Switch, Table, Toaster, useToast } from "@medusajs/ui";
import { useState, useEffect } from "react";
import { SETTING_TYPES } from "../../types/settings";

const UPLOAD_TARGET_LIST = [{ value: "local" }, { value: "s3" }, { value: "space" }];

export type StorageRes = {
  upload_target: {
    value: string;
    id: number;
  };
};

export type LocalStorageRes = {
  upload_dir: {
    value: string;
    id: number;
  };
  backend_url: {
    value: string;
    id: number;
  };
};

export type S3Res = {
  bucket: {
    value: string;
    id: number;
  };
  s3_url: {
    value: string;
    id: number;
  };
  secret_access_key: {
    value: string;
    id: number;
  };
  region: {
    value: string;
    id: number;
  };
  endpoint: {
    value: string;
    id: number;
  };
  access_key_id: {
    value: string;
    id: number;
  };
};

export type SpaceRes = {
  bucket: {
    value: string;
    id: number;
  };
  spaces_url: {
    value: string;
    id: number;
  };
  secret_access_key: {
    value: string;
    id: number;
  };
  region: {
    value: string;
    id: number;
  };
  endpoint: {
    value: string;
    id: number;
  };
  access_key_id: {
    value: string;
    id: number;
  };
};
const settingKeys = [
  {
    key: "display",
    displayName: "Display review",
  },
  {
    key: "customerOnlyPostReview",
    displayName: "Only customers can post",
  },
  {
    key: "newReviewIsDraft",
    displayName: "The new review is a draft",
  },
  {
    key: "numberReviewPerPage",
    displayName: "Number of reviews per page",
  },
];

export type SesSettingUpdatePostRes = {
  data: boolean;
};

const StorageSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<any>();

  const {
    data: dataStorage,
    isLoading: isLoadingStorage,
    refetch: refetchStorage,
  } = useAdminCustomQuery<{ type: string }, { storage: StorageRes }>("/settings", [], {
    type: SETTING_TYPES.storage,
  });

  const {
    data: dataLocalStorage,
    isLoading: isLoadingLocalStorage,
    refetch: refetchLocalStorage,
  } = useAdminCustomQuery<{ type: string }, { localStorage: LocalStorageRes }>("/settings", [], {
    type: SETTING_TYPES.localStorage,
  });
  const {
    data: dataS3,
    isLoading: isLoadingS3,
    refetch: refetchS3,
  } = useAdminCustomQuery<{ type: string }, { s3Config: S3Res }>("/settings", [], {
    type: SETTING_TYPES.s3Config,
  });
  const {
    data: dataSpace,
    isLoading: isLoadingSpace,
    refetch: refetchSpace,
  } = useAdminCustomQuery<{ type: string }, { digitalOceanSpace: SpaceRes }>("/settings", [], {
    type: SETTING_TYPES.digitalOceanSpace,
  });

  const { mutate, isLoading: isLoadingUpdate } = useAdminCustomPost<any, any>(`/settings/update`, []);
  const { mutate: applySettings } = useAdminCustomPost<any, any>(`/settings/storage-settings-apply`, []);

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
        refetchStorage();
        applySettings({});
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
    for (const key in dataStorage?.storage) {
      newSettings.push(dataStorage?.storage?.[key]);
    }
    for (const key in dataLocalStorage?.localStorage) {
      newSettings.push(dataLocalStorage?.localStorage?.[key]);
    }
    for (const key in dataS3?.s3Config) {
      newSettings.push(dataS3?.s3Config?.[key]);
    }
    for (const key in dataSpace?.digitalOceanSpace) {
      newSettings.push(dataSpace?.digitalOceanSpace?.[key]);
    }
    setSettings(newSettings);
  }, [dataStorage?.storage, dataLocalStorage?.localStorage, dataS3?.s3Config, dataSpace?.digitalOceanSpace]);

  return (
    <div>
      <BackButton label="Back to settings" path="/a/settings" className="mb-xsmall" />

      <BodyCard title="Setting Storage" customActionable={<Button onClick={handleUpdate}>Update</Button>}>
        <Toaster />
        {isLoadingStorage && isLoadingLocalStorage && isLoadingS3 && isLoadingSpace ? (
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
              <Table.Row>
                <Table.Cell>Select upload target</Table.Cell>
                <Table.Cell>
                  <Select
                    defaultValue={dataStorage?.storage?.upload_target?.value}
                    onValueChange={(e) => {
                      handleChangeSetting(e, dataStorage?.storage?.upload_target?.id);
                    }}
                  >
                    <Select.Trigger>
                      <Select.Value placeholder="Placeholder"  />
                    </Select.Trigger>
                    <Select.Content>
                      {UPLOAD_TARGET_LIST.map((item) => (
                        <Select.Item key={item.value} value={item.value}>
                          {item.value}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Local backend url</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={dataLocalStorage?.localStorage?.backend_url.value}
                    onChange={(e) => {
                      handleChangeSetting(e.target.value, dataLocalStorage?.localStorage?.backend_url?.id);
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>

              {/* S3 */}
              <Table.Row>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>S3 url</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={dataS3?.s3Config?.s3_url.value}
                    onChange={(e) => {
                      handleChangeSetting(e.target.value, dataS3?.s3Config?.s3_url?.id);
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>S3 bucket</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={dataS3?.s3Config?.bucket.value}
                    onChange={(e) => {
                      handleChangeSetting(e.target.value, dataS3?.s3Config?.bucket?.id);
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>S3 region</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={dataS3?.s3Config?.region.value}
                    onChange={(e) => {
                      handleChangeSetting(e.target.value, dataS3?.s3Config?.region?.id);
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>S3 endpoint</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={dataS3?.s3Config?.endpoint.value}
                    onChange={(e) => {
                      handleChangeSetting(e.target.value, dataS3?.s3Config?.endpoint?.id);
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>S3 access key id</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={dataS3?.s3Config?.access_key_id.value}
                    onChange={(e) => {
                      handleChangeSetting(e.target.value, dataS3?.s3Config?.access_key_id?.id);
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>S3 secret access key</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={dataS3?.s3Config?.secret_access_key.value}
                    onChange={(e) => {
                      handleChangeSetting(e.target.value, dataS3?.s3Config?.secret_access_key?.id);
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>

              {/* space */}
              <Table.Row>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Space url</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={dataSpace?.digitalOceanSpace?.spaces_url.value}
                    onChange={(e) => {
                      handleChangeSetting(e.target.value, dataSpace?.digitalOceanSpace?.spaces_url?.id);
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>Space bucket</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={dataSpace?.digitalOceanSpace?.bucket.value}
                    onChange={(e) => {
                      handleChangeSetting(e.target.value, dataSpace?.digitalOceanSpace?.bucket?.id);
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>Space region</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={dataSpace?.digitalOceanSpace?.region.value}
                    onChange={(e) => {
                      handleChangeSetting(e.target.value, dataSpace?.digitalOceanSpace?.region?.id);
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>Space endpoint</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={dataSpace?.digitalOceanSpace?.endpoint.value}
                    onChange={(e) => {
                      handleChangeSetting(e.target.value, dataSpace?.digitalOceanSpace?.endpoint?.id);
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>Space access key id</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={dataSpace?.digitalOceanSpace?.access_key_id.value}
                    onChange={(e) => {
                      handleChangeSetting(e.target.value, dataSpace?.digitalOceanSpace?.access_key_id?.id);
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>

              <Table.Row>
                <Table.Cell>Space secret access key</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={dataSpace?.digitalOceanSpace?.secret_access_key.value}
                    onChange={(e) => {
                      handleChangeSetting(e.target.value, dataSpace?.digitalOceanSpace?.secret_access_key?.id);
                    }}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
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
    label: "Storage",
    description: "Setting Storage",
    icon: ChatBubble,
  },
};

function toBoolean(e: any) {
  if (typeof e === "boolean") return e;
  if (typeof e === "string") return e === "true" || e === "1";
  return false;
}
export default StorageSettings;
