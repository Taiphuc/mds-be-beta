import type { RouteProps, SettingConfig } from "@medusajs/admin";
import { ChatBubble, Spinner } from "@medusajs/icons";
import { Button, Input, Switch, Table } from "@medusajs/ui";
import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react";
import { useEffect, useState } from "react";
import BackButton from "../../components/shared/back-button";
import BodyCard from "../../components/shared/body-card";
import Spacer from "../../components/shared/spacer";

export type ReviewSettingsRes = {
  display: {
    value: string;
    id: number;
  };
  customerOnlyPostReview: {
    value: string;
    id: number;
  };
  newReviewIsDraft: {
    value: string;
    id: number;
  };
  numberReviewPerPage: {
    value: string;
    id: number;
  };
};

export type SesSettingUpdatePostRes = {
  data: boolean;
};

const CustomReviewSettings = ({ notify }: RouteProps) => {
  const [settings, setSettings] = useState<any>();

  const { data, isLoading, refetch } = useAdminCustomQuery<
    { type: string },
    { review: ReviewSettingsRes }
  >("/settings", [], {
    type: "review",
  });

  const { mutate, isLoading: isLoadingUpdate } = useAdminCustomPost<any, any>(
    `/settings/update`,
    []
  );

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
        notify.success("Update success", "Update successfully");
      },
      onError() {
        notify.error("Update failed", "Please try again");
      },
    });
  };

  useEffect(() => {
    const reviewSettings = [];
    for (const key in data?.review) {
      reviewSettings.push(data?.review?.[key]);
    }
    setSettings(reviewSettings);
  }, [data?.review]);

  return (
    <div>
      <BackButton
        label="Back to settings"
        path="/a/settings"
        className="mb-xsmall"
      />

      <BodyCard
        title="Setting Review"
        customActionable={<Button onClick={handleUpdate}>Update</Button>}
      >
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
              <Table.Row>
                <Table.Cell>Display review</Table.Cell>
                <Table.Cell>
                  <Switch
                    onCheckedChange={(e) => {
                      handleChangeSetting(
                        e ? "1" : "0",
                        data?.review?.display?.id
                      );
                    }}
                    defaultChecked={toBoolean(data?.review?.display?.value)}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Only customers can post</Table.Cell>
                <Table.Cell>
                  <Switch
                    onCheckedChange={(e) => {
                      handleChangeSetting(
                        e ? "1" : "0",
                        data?.review?.customerOnlyPostReview?.id
                      );
                    }}
                    defaultChecked={toBoolean(
                      data?.review?.customerOnlyPostReview?.value
                    )}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>The new review is a draft</Table.Cell>
                <Table.Cell>
                  <Switch
                    onCheckedChange={(e) => {
                      handleChangeSetting(
                        e ? "1" : "0",
                        data?.review?.newReviewIsDraft?.id
                      );
                    }}
                    defaultChecked={toBoolean(
                      data?.review?.newReviewIsDraft?.value
                    )}
                  />
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Number of reviews per page</Table.Cell>
                <Table.Cell>
                  <Input
                    defaultValue={data?.review?.numberReviewPerPage.value}
                    type="number"
                    onChange={(e) => {
                      handleChangeSetting(
                        e.target.value,
                        data?.review?.numberReviewPerPage?.id
                      );
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
    label: "Review",
    description: "Setting Review",
    icon: ChatBubble,
  },
};

function toBoolean(e: any) {
  if (typeof e === "boolean") return e;
  if (typeof e === "string") return e === "true" || e === "1";
  return false;
}
export default CustomReviewSettings;
