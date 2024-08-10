import { RouteProps } from "@medusajs/admin";
import { FC, useState, ChangeEvent } from "react";
import { useAdminCustomPost } from "medusa-react";
import InputField from "../../input";
import Modal from "../../molecules/modal";
import Button from "../button";

interface AddGroupMenuProps extends RouteProps {
  isOpen: boolean;
  open: () => void;
  reload: () => void;
  close: () => void;
}
const AddGroupMenu: FC<AddGroupMenuProps> = ({ open, reload, isOpen, close, notify }) => {
  const [createGroupData, setCreateGroupData] = useState({ title: "", link: "" });
  const { mutateAsync: createGroup } = useAdminCustomPost<any, any>(`/menu/create`, []);
  const handleChangeMenuName = (e: ChangeEvent<HTMLInputElement>) => {
    const newMenu = {
      title: e.target.value,
      link: e.target.value.trim().toLowerCase().replace(/ /gi, "-"),
    };
    setCreateGroupData(newMenu);
  };
  const handleChangeLink = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateGroupData({ ...createGroupData, link: e.target.value });
  };

  const onSave = async () => {
    try {
      await createGroup(createGroupData);
      notify.success("Create successfully", "Menu created successfully");
      reload();
      close();
    } catch (e) {
      notify.error("Error updating", "Menu updated error");
    }
  };

  return (
    <Modal open={isOpen} handleClose={close}>
      <Modal.Body>
        <Modal.Header handleClose={close}>
          <h1 className="inter-xlarge-semibold m-0">Add New Group</h1>
        </Modal.Header>
        <Modal.Content>
          <InputField
            required
            label="title"
            type="string"
            name="title"
            value={createGroupData?.title}
            className="my-6"
            placeholder={"Group title"}
            onChange={handleChangeMenuName}
            autoFocus
          />

          <InputField
            required
            label="Handle"
            type="string"
            name="link"
            value={createGroupData?.link}
            className="my-6"
            placeholder="handle of group"
            onChange={handleChangeLink}
          />
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end gap-x-2">
            <Button size="small" variant="secondary" type="button" onClick={close}>
              Cancel
            </Button>
            <Button
              size="small"
              variant="primary"
              type="submit"
              onClick={() => {
                onSave();
                close();
              }}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
};
export default AddGroupMenu;
