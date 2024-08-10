import { FC, useState } from "react";
import LayeredModal, { useLayeredModal } from "../../molecules/modal/layered-modal";
import Modal from "../../molecules/modal";
import InputField from "../../input";
import { useAdminCustomPost } from "medusa-react";
import Button from "../button";
import { RouteProps } from "@medusajs/admin";

type AddThemeModal = { open: boolean; onClose: () => void; reload: () => void } & RouteProps;
const AddThemeModal: FC<AddThemeModal> = ({ open, onClose, notify, reload }) => {
  const context = useLayeredModal();
  const [name, setName] = useState("");
  const { mutate: createTheme } = useAdminCustomPost<any, any>(`/theme`, []);

  const handleCreateTheme = () => {
    createTheme(
      {
        name,
        metadata: {},
        settings: null,
        pages: {},
        status: false,
      },
      {
        onSuccess: () => {
          notify.success("Theme created", "Theme created successfully!");
          setName("");
          onClose();
          reload()
        },
        onError: () => {
          notify.error("Create theme failed", "Cannot create theme, please try again later!");
        },
      }
    );
  };
  return (
    <LayeredModal open={open} handleClose={onClose} context={context}>
      <Modal.Header handleClose={onClose}>
        <h1 className="inter-xlarge-semibold">Add a theme</h1>
      </Modal.Header>
      <Modal.Body className="px-4">
        <InputField
          required
          label="Theme name."
          type="string"
          name="name"
          value={name}
          className="my-6"
          placeholder={"Theme name"}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="flex w-full items-center justify-end space-x-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="button" onClick={handleCreateTheme}>
            Create
          </Button>
        </div>
      </Modal.Footer>
    </LayeredModal>
  );
};
export default AddThemeModal;
