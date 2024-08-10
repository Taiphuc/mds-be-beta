import { RouteProps, SettingConfig } from "@medusajs/admin";
import { CommandLine, PencilSquare } from "@medusajs/icons";
import { Image as ImageType } from "@medusajs/medusa";
import {
  Button,
  Heading,
  IconButton,
  Table,
  useToggleState,
} from "@medusajs/ui";
import { Image, Spin } from "antd";
import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react";
import { FC, useState } from "react";
import BodyCard from "../../components/shared/body-card";
import MediaModal from "../../components/shared/media/MediaModal";
import UpdateContentModal from "./components/UpdateContentModal";

export type StaticContentSettingsRes = {
  logo: { value: string; id: number };
  favicon: { value: string; id: number };
  why_buy_from_us: { value: string; id: number };
  return_and_refund_policy: { value: string; id: number };
  privacy_policy: { value: string; id: number };
  terms_of_service: { value: string; id: number };
  shipping_policy: { value: string; id: number };
  contact_information: { value: string; id: number };
};

const StaticContent: FC = ({ notify }: RouteProps) => {
  const [contentUpdate, setContentUpdate] = useState<{
    value: string;
    id: number;
  }>();
  const [mediaType, setMediaType] = useState<"logo" | "favicon">();
  const { state: isOpenMedia, toggle: toggleOpenMedia } = useToggleState();
  const { state: isOpenContentModal, toggle: toggleOpenContentModal } =
    useToggleState();

  const { data: fetchStaticContent, isLoading: isLoadingStaticContent } =
    useAdminCustomQuery<
      { type: string },
      { staticContent: StaticContentSettingsRes }
    >("/settings", [], {
      type: "staticContent",
    });

  const { mutate: mutateUpdateStaticContent, isLoading: isLoadingUpdate } =
    useAdminCustomPost(`/settings/update`, []);

  const onSelectLogo = (v: ImageType[]) => {
    if (!fetchStaticContent) return;
    switch (mediaType) {
      case "logo": {
        const { logo } = fetchStaticContent.staticContent;
        logo.value = v[0].url;

        mutateUpdateStaticContent([logo], {
          onSuccess: () => {
            notify.success("Success", "Logo update successful");
          },
          onSettled: () => {
            toggleOpenMedia();
          },
        });
      }
      case "favicon": {
        const { favicon } = fetchStaticContent.staticContent;
        favicon.value = v[0].url;

        mutateUpdateStaticContent([favicon], {
          onSuccess: () => {
            notify.success("Success", "Favicon update successful");
          },
          onSettled: () => {
            toggleOpenMedia();
          },
        });
      }
      default: {
      }
    }
  };
  const onUpdateContent = (v: { value: string; id: number }) => {
    mutateUpdateStaticContent([v], {
      onSuccess: () => {
        notify.success("Success", "Logo static content successful");
      },
      onSettled: () => {
        toggleOpenContentModal();
      },
    });
  };

  const listStaticContent = [
    { key: "why_buy_from_us", label: "Why buy from us" },
  ];

  return (
    <BodyCard
      className="h-full"
      title="Static content"
      subtitle="Static Content Management"
      footerMinHeight={40}
      setBorders
    >
      {isLoadingStaticContent ? (
        <div className="w-full flex items-center justify-center h-56">
          <Spin />
        </div>
      ) : (
        <>
          <div className="flex flex-col my-5 gap-y-3">
            <div className="flex justify-between items-center">
              <Heading level="h2">Logo</Heading>
              <Button
                variant="transparent"
                onClick={() => {
                  setMediaType("logo");
                  toggleOpenMedia();
                }}
              >
                Select Image
              </Button>
            </div>
            <div>
              {fetchStaticContent && (
                <Image
                  className="max-w-[200px] max-h-[150px]"
                  preview={false}
                  src={fetchStaticContent.staticContent.logo.value}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col my-5 gap-y-3">
            <div className="flex justify-between items-center">
              <Heading level="h2">Favicon</Heading>
              <Button
                variant="transparent"
                onClick={() => {
                  setMediaType("favicon");
                  toggleOpenMedia();
                }}
              >
                Select Favicon
              </Button>
            </div>
            <div>
              {fetchStaticContent && (
                <Image
                  className="max-w-[200px] max-h-[150px]"
                  preview={false}
                  src={fetchStaticContent.staticContent.favicon.value}
                />
              )}
            </div>
          </div>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Key</Table.HeaderCell>
                <Table.HeaderCell>Action</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {listStaticContent.map((item) => (
                <Table.Row key={item.key}>
                  <Table.Cell className="w-[90%]">{item.label}</Table.Cell>
                  <Table.Cell>
                    <IconButton
                      onClick={() => {
                        const content =
                          fetchStaticContent.staticContent[item.key];
                        setContentUpdate(content);
                        toggleOpenContentModal();
                      }}
                    >
                      <PencilSquare />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      )}

      <MediaModal
        isLoading={isLoadingUpdate}
        notify={notify}
        type="thumbnail"
        open={isOpenMedia}
        onClose={toggleOpenMedia}
        onFinish={onSelectLogo}
      />
      {fetchStaticContent && contentUpdate && (
        <UpdateContentModal
          content={contentUpdate}
          onFinish={onUpdateContent}
          open={isOpenContentModal}
          onClose={toggleOpenContentModal}
        />
      )}
    </BodyCard>
  );
};

export const config: SettingConfig = {
  card: {
    label: "Static content",
    description: "Static content management",
    icon: CommandLine,
  },
};
export default StaticContent;
