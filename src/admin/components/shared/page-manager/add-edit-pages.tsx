"use-client"

import { useEffect, useState, ChangeEvent } from "react";
import { useAdminCustomPost } from "medusa-react";
import { RouteProps } from "@medusajs/admin";
import InputField from "../../input";
import { NextSelect } from "../../molecules/select/next-select";
import { Page } from "src/models/page";
import { Button, FocusModal } from "@medusajs/ui";
import TextArea from "../../molecules/textarea";
import FormEditBlock from "./custom-add";

interface AddEditMenuSideModalProps extends RouteProps {
  activePage?: Page;
  close: () => void;
  isVisible: boolean;
  reload: () => void;
}

export type MenuUpdateReq = {
  id?: string;
  title?: string;
  link?: string;
  code?: string;
  metadata?: string;
  body?: string;
  active?: boolean;
};

const statusOptions = [
  { label: "Active", value: "1" },
  { label: "Inactive", value: "0" },
];

const defaultPage = { active: true };

/**
 * Modal for editing product categories
 */
function AddEditMenuSideModal(props: AddEditMenuSideModalProps) {
  const { isVisible, close, activePage, notify, reload } = props;
  const [page, setPage] = useState(defaultPage as MenuUpdateReq);
  const isUpdate = !!activePage;
  const { mutateAsync: updatePage } = useAdminCustomPost<any, any>(`/pages/update`, []);
  const { mutateAsync: createPage } = useAdminCustomPost<any, any>(`/pages/create`, []);

  const handleChangeMenuName = (e: ChangeEvent<HTMLInputElement>) => {
    const newPage = {
      ...page,
      title: e.target.value,
      link: e.target.value.trim().toLowerCase().replace(/ /gi, "-"),
    };
    setPage(newPage);
  };
  const handleChangeValue = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPage({ ...page, [name]: name === "code" ? value?.toLowerCase() : value });
  };

  const handleChangeBody = (e: string) => {
    const pageUpdate = {
      ...page,
      body: e
    }
    setPage(pageUpdate);
  };

  useEffect(() => {
    if (activePage) {
      setPage({...activePage});
    }
  }, [activePage]);

  const handleAddPage = async () => {
    try {
      if (activePage) {
        await updatePage(page);
        notify.success("Update successfully", "Page updated successfully");
      } else {
        await createPage(page);
        notify.success("Create successfully", "Page created successfully");
      }
      reload();
      close();
    } catch (e) {
      notify.error("Error updating", "Page updated error");
    }
  };

  const onClose = () => {
    setPage(defaultPage);
    close();
  };

  return (
    <FocusModal open={isVisible} onOpenChange={onClose}>
      <FocusModal.Trigger></FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header>{isUpdate ? "Edit a page" : "Add new page"}</FocusModal.Header>
        <FocusModal.Body style={{ overflow: "auto" }}>
          {activePage && <div className="mt-[25px] px-6">{activePage?.title}</div>}
          <div className="flex flex-wrap justify-between p-4">
            <div className="w-1/4 pr-2">
              <InputField
                required
                label="title"
                type="string"
                name="title"
                value={page?.title}
                className="mb-6"
                placeholder={"Menu title"}
                onChange={handleChangeMenuName}
              />

              <InputField
                required
                label="Link"
                type="string"
                name="link"
                value={page?.link}
                className="my-6"
                placeholder="Link slug of page"
                onChange={handleChangeValue}
              />
              <InputField
                required
                label="Code"
                type="string"
                name="code"
                value={page?.code}
                className="my-6"
                placeholder="Code of page is unique"
                onChange={handleChangeValue}
              />
              <TextArea
                label="Metadata"
                name="metadata"
                value={page?.metadata || ''}
                placeholder={"Write metadata for this page ..."}
                rows={3}
                className="mb-small"
                onChange={handleChangeValue}
              />
              <NextSelect
                label="Status"
                options={statusOptions}
                value={statusOptions[page.active ? 0 : 1]}
                isMulti={false}
                onChange={({ value }: { value: string }) => {
                  setPage({ ...page, active: value === "1" });
                }}
              />
              <div className="py-4 flex w-full justify-center gap-5">
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleAddPage} variant="secondary">
                  {isUpdate ? "Update" : "Create"}
                </Button>
              </div>
            </div>
            <div className="w-3/4 pl-2">
              {/* <TextArea
                label="Page Body"
                name="body"
                placeholder={"Write body for this page (type JSON)..."}
                rows={20}
                value={page?.body}
                className="mb-small"
                onChange={handleChangeValue}
              /> */}
              <FormEditBlock  data={page?.body || null} onChange={handleChangeBody} />
            </div>
          </div>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
}

export default AddEditMenuSideModal;
