import { RouteProps } from "@medusajs/admin";
import { FC, useState, useEffect } from "react";
import BodyCard from "../body-card";
import BackButton from "../back-button";
import { Tabs } from "@medusajs/ui";
import ThemeSetting from "./ThemeSetting";
import { useAdminCustomPost, useAdminCustomQuery } from "medusa-react";
import { useParams } from "react-router-dom";
import { DEFAULT_THEME_SETTINGS } from "./const/defaultTheme";
import ThemePage from "./ThemePage";
import Spacer from "../spacer";

type UpdateThemePageProps = {} & RouteProps;
const UpdateThemePage: FC<UpdateThemePageProps> = ({ notify }) => {
  const { id } = useParams();
  const { mutate: mutateUpdateTheme } = useAdminCustomPost<any, any>(
    `/theme/update`,
    []
  );
  const {
    data: res,
    isLoading: isLoadingPages,
    refetch: refetchPages,
  } = useAdminCustomQuery<any, any>("/theme/" + id, []);
  const theme = res?.data;
  const [updateTheme, setUpdateTheme] = useState<any>();

  const handleUpdateTheme = (isDefault?: boolean) => {
    mutateUpdateTheme(
      { ...updateTheme, ...(isDefault ? { status: true } : {}) },
      {
        onSuccess: () => {
          notify.success("Theme updated", "theme update successfully");
          refetchPages();
        },
        onError: () => {
          notify.error("Theme update error", "Please try again later");
        },
      }
    );
  };

  const handleSetDefaultTheme = () => {
    handleUpdateTheme(true);
  };

  useEffect(() => {
    if (theme) {
      const pages = theme?.pages?.map((page) => page?.id);
      setUpdateTheme({
        ...theme,
        pages,
        settings: theme?.settings || DEFAULT_THEME_SETTINGS,
      });
    }
  }, [theme]);

  return (
    <div>
      <BackButton
        label="Back to settings"
        path="/a/theme"
        className="mb-xsmall"
      />
      <BodyCard
        className="h-full"
        title="Update theme"
        actionables={[
          {
            label: "Save",
            onClick: () => {
              handleUpdateTheme();
            },
          },
          {
            label: "Set to default",
            onClick: handleSetDefaultTheme,
          },
        ]}
        footerMinHeight={40}
        setBorders
      >
        <div className="py-2">
          <Tabs defaultValue="1">
            <Tabs.List>
              <Tabs.Trigger value="1">Settings</Tabs.Trigger>
              <Tabs.Trigger value="2">Pages</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="1">
              <ThemeSetting
                theme={theme}
                updateTheme={updateTheme}
                setUpdateTheme={setUpdateTheme}
              />
            </Tabs.Content>
            <Tabs.Content value="2">
              <ThemePage
                theme={theme}
                updateTheme={updateTheme}
                setUpdateTheme={setUpdateTheme}
              />
            </Tabs.Content>
          </Tabs>
        </div>
      </BodyCard>
      <Spacer />
    </div>
  );
};
export default UpdateThemePage;
