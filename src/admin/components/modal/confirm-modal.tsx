import { Modal } from "antd";
import { FC } from "react";
type ConfirmModalProps = {
  open: boolean;
  title?: string;
  description?: string;
  toggle: () => void;
  action: () => void;
  okText?: string;
  cancelText?: string;
  loading?: boolean;
};
const ConfirmModal: FC<ConfirmModalProps> = ({
  open,
  action,
  toggle,
  description,
  title,
  okText = "Execute",
  cancelText = "Cancel",
  loading,
}) => {
  return (
    <Modal
      centered
      title={title}
      okButtonProps={{ type: "default", danger: true }}
      okText={okText}
      cancelText={cancelText}
      open={open}
      onOk={() => {
        action();
        if (loading === undefined) {
          toggle();
        }
      }}
      onCancel={toggle}
      confirmLoading={loading}
    >
      <p>{description}</p>
    </Modal>
    // <Prompt open={open}>
    //   <Prompt.Content>
    //     <Prompt.Header>
    //       <Prompt.Title>{title}</Prompt.Title>
    //       <Prompt.Description>{description}</Prompt.Description>
    //     </Prompt.Header>
    //     <Prompt.Footer>
    //       <Prompt.Cancel onClick={toggle}>{cancelText}</Prompt.Cancel>
    //       <Prompt.Action
    //         onClick={() => {
    //           toggle();
    //           action();
    //         }}
    //       >
    //         {okText}
    //       </Prompt.Action>
    //     </Prompt.Footer>
    //   </Prompt.Content>
    // </Prompt>
  );
};
export default ConfirmModal;
