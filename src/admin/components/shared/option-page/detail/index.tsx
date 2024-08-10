import { useParams } from "react-router-dom";
import { Notify } from "../../../../components/types/extensions";
import { Form, Skeleton } from "antd";
import HomeForm from "../components/HomeForm";
import CustomerServiceForm from "../components/CustomerServiceForm";
import BackButton from "../../back-button";
import BodyCard from "../../body-card";
import { useAdminCustomQuery, useAdminCustomPost } from "medusa-react";
import { ApiResponse } from "../../../../types/utils";
import ContactUsForm from "../components/ContactUsForm";
import StoreForm from "../components/StoreForm";

enum EOptionPage {
  HOME = "home",
  CUSTOMER_SERVICE = "customer_service",
  CONTACT_US = "contact_us",
  STORE = "store",
}
type TOptionPageItem = {
  key: string;
  id: string;
  value: Record<string, any>;
};
type DetailOptionPage = {
  notify: Notify;
};
export default function DetailOptionPage({ notify }: DetailOptionPage) {
  const [form] = Form.useForm();
  const { key } = useParams();

  const { data, isLoading: isLoadingOptionPage } = useAdminCustomQuery<
    { keys: string[] },
    ApiResponse<{ data: TOptionPageItem[] }>
  >("option-page/find-by-key", [], {
    keys: [key],
  });
  const { mutate: mutateUpdate, isLoading: isLoadingUpdate } =
    useAdminCustomPost("option-page/" + key, []);

  const onFinish = (values: any) => {
    mutateUpdate(
      { ...values, popular_tags: form.getFieldValue("popular_tags") },
      {
        onSuccess: () => {
          notify.success("Success", "Update option page successfully");
        },
      }
    );
  };
  return (
    <div>
      <BackButton
        label="Back to option pages"
        path="/a/option-page"
        className="mb-xsmall"
      />
      <BodyCard
        className="h-full"
        title="Option page edit"
        footerMinHeight={40}
        actionables={[
          {
            label: "Save",
            onClick: form.submit,
            loading: isLoadingUpdate,
          },
        ]}
        setBorders
      >
        <Skeleton
          className="mt-3"
          loading={isLoadingOptionPage}
          active
          title={false}
        >
          {!isLoadingOptionPage && (
            <div className="mt-3 py-3">
              {key === EOptionPage.HOME && (
                <HomeForm
                  initialValues={data.data[0].value}
                  form={form}
                  notify={notify}
                  onFinish={onFinish}
                />
              )}
              {key === EOptionPage.CUSTOMER_SERVICE && (
                <CustomerServiceForm
                  initialValues={data.data[0].value}
                  form={form}
                  notify={notify}
                  onFinish={onFinish}
                />
              )}
              {key === EOptionPage.CONTACT_US && (
                <ContactUsForm
                  initialValues={data.data[0].value}
                  form={form}
                  notify={notify}
                  onFinish={onFinish}
                />
              )}
              {key === EOptionPage.STORE && (
                <StoreForm
                  initialValues={data.data[0].value}
                  form={form}
                  notify={notify}
                  onFinish={onFinish}
                />
              )}
            </div>
          )}
        </Skeleton>
      </BodyCard>
    </div>
  );
}
