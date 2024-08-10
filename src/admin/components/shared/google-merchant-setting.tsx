import React from "react";
import { useState, useMemo } from "react";
import BodyCard from "./body-card";
import Spinner from "./spinner";
import { Table, Input, Toaster, useToast } from "@medusajs/ui";
import { Check } from "@medusajs/icons";
import EditIcon from "./icons/edit-icon";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { GoogleMerchantSetting } from "src/models/google-merchant-setting";
import { AdminUploadsRes } from "@medusajs/medusa";

const columns = [
  {
    title: "#",
    key: "#",
  },
  {
    title: "Merchant Id",
    key: "merchant_id",
  },
  {
    title: "Client Email",
    key: "client_email",
  },
  {
    title: "Private Key",
    key: "private_key",
  },
  {
    title: "Action",
    key: "action",
  },
];

export type GoogleMerchantSettingGetRes = {
  data: GoogleMerchantSetting;
};

export type GoogleMerchantSettingUpdatePostRes = {
  data: boolean;
};

const GoogleMerchantSettings: React.FC = () => {
  const { toast } = useToast();
  const [currentGoogleMerchantSettingEdit, setCurrentGoogleMerchantSettingEdit] = useState<any>();
  const [file, setFile] = useState<File | null>(null);

  const {
    data: dataGoogleMerchantSetting,
    isLoading,
    refetch,
  } = useAdminCustomQuery<undefined, GoogleMerchantSettingGetRes>("/google-merchant-setting", []);

  const { mutate, isLoading: isLoadingUpdate } = useAdminCustomPost<any, GoogleMerchantSettingUpdatePostRes>(
    `/google-merchant-setting/update/${currentGoogleMerchantSettingEdit?.id}`,
    []
  );
  const { mutate: mutateUpload } = useAdminCustomPost<FormData, AdminUploadsRes>(`/uploads/protected`, []);

  const handleChangeFile = (e) => {
    setFile(e.target.files[0]);
  };

  const ggMerchant = useMemo(() => {
    return {
      id: dataGoogleMerchantSetting?.data.id,
      merchant_id: dataGoogleMerchantSetting?.data.merchant_id || "",
      client_email: dataGoogleMerchantSetting?.data.client_email || "",
      private_key: dataGoogleMerchantSetting?.data.private_key || "",
    };
  }, [dataGoogleMerchantSetting]);

  const handleUpdateSetting = () => {
    if (file.size > 10000) {
      toast({
        title: "File is too large",
        variant: "error",
        duration: 1500,
      });
      return;
    }
    const formData = new FormData();
    formData.append("files", file);
    mutateUpload(formData, {
      onSuccess(uploadRes) {
        const data = { ...currentGoogleMerchantSettingEdit, private_key: uploadRes?.uploads[0]?.key };
        delete data.id;
        mutate(data, {
          onSuccess: (res) => {
            refetch();
            toast({
              title: "Update Successful",
              description: "Update Sms Successful",
              variant: "success",
              duration: 1500,
            });
          },
        });
        setCurrentGoogleMerchantSettingEdit(undefined);
      },
    });
  };

  const handleChange = (event) => {
    setCurrentGoogleMerchantSettingEdit((e) => {
      const data = Object.assign({}, e);
      data[event.target.name] = event.target.value;
      return data;
    });
  };

  return (
    <BodyCard title="Google Merchant Setting" subtitle="Google Merchant Setting">
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
            {currentGoogleMerchantSettingEdit?.id ? (
              <Table.Row>
                <Table.Cell>1</Table.Cell>
                <Table.Cell>
                  <Input
                    value={currentGoogleMerchantSettingEdit.merchant_id}
                    onChange={handleChange}
                    name="merchant_id"
                    placeholder="Merchant Id"
                    size="small"
                  />
                </Table.Cell>
                <Table.Cell>
                  <Input
                    value={currentGoogleMerchantSettingEdit.client_email}
                    onChange={handleChange}
                    placeholder="Client Email"
                    name="client_email"
                    size="small"
                  />
                </Table.Cell>
                <Table.Cell>
                  <input
                    placeholder="Private Key"
                    accept=".json"
                    onChange={handleChangeFile}
                    name="private_key"
                    type="file"
                  />
                </Table.Cell>
                <Table.Cell>
                  <Check cursor={"pointer"} onClick={handleUpdateSetting} />
                </Table.Cell>
              </Table.Row>
            ) : (
              <Table.Row>
                <Table.Cell>1</Table.Cell>
                <Table.Cell>{ggMerchant.merchant_id}</Table.Cell>
                <Table.Cell>{ggMerchant.client_email}</Table.Cell>
                <Table.Cell>********************</Table.Cell>
                <Table.Cell>
                  <EditIcon
                    cursor={"pointer"}
                    size={20}
                    onClick={() => setCurrentGoogleMerchantSettingEdit(ggMerchant)}
                  />
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      )}
    </BodyCard>
  );
};
export default GoogleMerchantSettings;
